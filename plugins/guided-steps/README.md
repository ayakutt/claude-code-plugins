# guided-steps

Teaches [Claude Code](https://claude.ai/code) to deliver multi-step instructions one step at a time, waiting for your confirmation before moving on.

## The problem

When you ask Claude how to do something with many steps (deploying an app, setting up a service, etc.), it dumps all the steps at once. This can be overwhelming and makes it hard to follow along or ask questions about individual steps.

## How it works

Installs a [skill](https://docs.anthropic.com/en/docs/claude-code/skills) that changes how Claude delivers procedural instructions:

1. Announces how many steps there are upfront
2. Shows one step at a time with clear formatting
3. Waits for your confirmation before proceeding
4. Handles mid-step questions gracefully

## Install

```sh
/plugin marketplace add ayakutt/claude-code-plugins
/plugin install guided-steps@claude-plugins-ayakutt
```

## Usage

The skill activates automatically when Claude detects a multi-step explanation. You can also invoke it explicitly:

```
/guided-steps
```

Then ask your question:

```
How do I publish my iOS app to the App Store?
```

## Uninstall

```sh
/plugin uninstall guided-steps@claude-plugins-ayakutt
```
