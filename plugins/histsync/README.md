# histsync

Automatically adds commands that [Claude Code](https://claude.ai/code) runs on your behalf to your shell history.

## The problem

When Claude Code executes bash commands, they run in a subprocess and never reach your shell history. This means you can't search or reuse them later.

## How it works

Installs a Claude Code [hook](https://docs.anthropic.com/en/docs/claude-code/hooks) that fires after every Bash tool call, reads the command from stdin, and writes it to your history backend in the correct format.

## Supported backends

Detected automatically in priority order:

| Backend | Detection |
|---------|-----------|
| [atuin](https://github.com/atuinsh/atuin) | `atuin` on PATH |
| [mcfly](https://github.com/cantino/mcfly) | `mcfly` on PATH |
| fish | `$SHELL` contains `fish` |
| zsh | `$SHELL` contains `zsh` |
| bash | fallback |

Tools that read from native history files (fzf, hstr, etc.) are covered through the zsh/bash backends.

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

After an entry is written, your **current terminal session** won't see it until you open a new tab or run `fc -R` to reload history manually. If you have `setopt SHARE_HISTORY` in your `.zshrc`, new entries are picked up automatically.

## Uninstall

```sh
/plugin uninstall histsync@claude-plugins-ayakutt
```

## Adding a new backend

Add a `writeMyBackend()` function to `hooks/history-sync.js` and a detection check in `detectAndWrite()`:

```js
function writeMyBackend(cmd) {
  const res = spawnSync('mybackend', ['add', '--', cmd]);
  return res.status === 0;
}
```

Then in `detectAndWrite()`, before the shell-native fallback:

```js
if (onPath('mybackend') && writeMyBackend(cmd)) return;
```

PRs welcome.
