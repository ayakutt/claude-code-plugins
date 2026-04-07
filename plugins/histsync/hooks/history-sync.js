#!/usr/bin/env node
//
// histsync — Sync Claude Code bash commands to your shell history
//
// Runs as a Claude Code PostToolUse hook for the Bash tool.
// Reads the executed command from stdin and appends it to bash history.

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

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

// --- bash history writer ---

function writeBash(cmd) {
  const file = process.env.HISTFILE || path.join(os.homedir(), '.bash_history');
  // Include timestamp comment (compatible with HISTTIMEFORMAT; ignored without it)
  const entry = `#${Math.floor(Date.now() / 1000)}\n${cmd}\n`;
  fs.appendFileSync(file, entry);
}

// --- Main ---

function main() {
  const cmd = extractCommand(readStdin());
  if (!cmd) process.exit(0);

  try {
    writeBash(cmd);
  } catch {
    // Best-effort hook — never block Claude Code on history-sync failures.
  }
}

main();
