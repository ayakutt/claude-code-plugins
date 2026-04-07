#!/usr/bin/env node
//
// histsync — Sync Claude Code bash commands to your shell history
//
// Runs as a Claude Code PostToolUse hook for the Bash tool.
// Auto-detects your history backend and writes commands in the correct format.
//
// Supported backends (checked in priority order):
//   1. atuin        (SQLite database)
//   2. mcfly        (SQLite database)
//   3. fish shell   (~/.local/share/fish/fish_history, YAML format)
//   4. zsh          ($HISTFILE, extended history format)
//   5. bash         ($HISTFILE, with optional timestamps)

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// --- stdin / JSON parsing ---
// Claude Code passes hook data via stdin as JSON:
// { "tool_name": "Bash", "tool_input": { "command": "..." }, ... }

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function extractCommand(raw) {
  if (!raw) return '';
  try {
    const data = JSON.parse(raw);
    return (data && data.tool_input && data.tool_input.command) || '';
  } catch {
    return '';
  }
}

// --- PATH lookup (no `which` dependency) ---

function onPath(bin) {
  const PATH = process.env.PATH || '';
  for (const dir of PATH.split(path.delimiter)) {
    if (!dir) continue;
    try {
      fs.accessSync(path.join(dir, bin), fs.constants.X_OK);
      return true;
    } catch {}
  }
  return false;
}

// --- Adapters ---
// Each adapter writes a command to its respective history store and returns
// true on success, false on failure. To add a new backend, add a write<Name>()
// function here and a check in detectAndWrite().

function writeAtuin(cmd) {
  const start = spawnSync('atuin', ['history', 'start', '--', cmd], { encoding: 'utf8' });
  if (start.status !== 0) return false;
  const id = (start.stdout || '').trim();
  if (!id) return false;
  const end = spawnSync('atuin', ['history', 'end', '--exit', '0', '--', id]);
  return end.status === 0;
}

function writeMcfly(cmd) {
  const res = spawnSync('mcfly', ['add', '--', cmd]);
  return res.status === 0;
}

function writeFish(cmd) {
  const file = process.env.fish_history || path.join(os.homedir(), '.local/share/fish/fish_history');
  // Fish uses YAML-like format; newlines in commands become literal \n
  const escaped = cmd.replace(/\n/g, '\\n');
  const entry = `- cmd: ${escaped}\n  when: ${Math.floor(Date.now() / 1000)}\n`;
  fs.appendFileSync(file, entry);
  return true;
}

function writeZsh(cmd) {
  const file = process.env.HISTFILE || path.join(os.homedir(), '.zsh_history');
  // Zsh extended history format: ": timestamp:duration;command"
  // Multiline commands use backslash-newline continuation.
  const escaped = cmd.replace(/\n/g, '\\\n');
  const entry = `: ${Math.floor(Date.now() / 1000)}:0;${escaped}\n`;
  fs.appendFileSync(file, entry);
  return true;
}

function writeBash(cmd) {
  const file = process.env.HISTFILE || path.join(os.homedir(), '.bash_history');
  // Include timestamp comment (compatible with HISTTIMEFORMAT; ignored without it)
  const entry = `#${Math.floor(Date.now() / 1000)}\n${cmd}\n`;
  fs.appendFileSync(file, entry);
  return true;
}

// --- Detection ---

function detectAndWrite(cmd) {
  // Priority 1: Dedicated history tools
  if (onPath('atuin') && writeAtuin(cmd)) return;
  if (onPath('mcfly') && writeMcfly(cmd)) return;

  // Priority 2: Shell-native history (also serves as fallback)
  const shellName = path.basename(process.env.SHELL || 'bash');
  switch (shellName) {
    case 'fish':
      writeFish(cmd);
      return;
    case 'zsh':
      writeZsh(cmd);
      return;
    default:
      writeBash(cmd);
      return;
  }
}

// --- Main ---

function main() {
  const cmd = extractCommand(readStdin());
  if (!cmd) process.exit(0);

  try {
    detectAndWrite(cmd);
  } catch {
    // Best-effort hook — never block Claude Code on history-sync failures.
  }
}

main();
