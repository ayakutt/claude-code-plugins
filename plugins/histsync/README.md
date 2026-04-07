# histsync

Automatically adds commands that [Claude Code](https://claude.ai/code) runs on your behalf to your bash history.

## The problem

When Claude Code executes bash commands, they run in a subprocess and never reach your shell history. This means you can't search or reuse them later.

## How it works

Installs a Claude Code [hook](https://docs.anthropic.com/en/docs/claude-code/hooks) that fires after every Bash tool call, reads the command from stdin, and appends it to your `$HISTFILE` (or `~/.bash_history`).

## Requirements

**Node.js** must be on your `PATH`. The hook is a short Node script that parses the tool payload and appends to your history file.

```sh
brew install node        # macOS
apt install nodejs       # Debian/Ubuntu
```

## Install

```sh
/plugin marketplace add ayakutt/claude-code-plugins
/plugin install histsync@claude-plugins-ayakutt
```

## Note on history reloading

After an entry is written, your **current terminal session** won't see it until you open a new tab or run `history -r` to reload history manually.

## Uninstall

```sh
/plugin uninstall histsync@claude-plugins-ayakutt
```
