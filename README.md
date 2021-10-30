# coc-ecs

[PHP CS Fixer](https://github.com/FriendsOfPHP/ecs) (PHP Coding Standards Fixer) extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

## Install

`:CocInstall coc-ecs`

## Note

Detects the `ecs` command. They are prioritized in order from the top.

1. `ecs.toolPath`
1. `vendor/bin/ecs`

If not found, you should install it, for example with:

```
composer global require symplify/easy-coding-standard
```

## Usage

### Format document

**Run from CocCommand**:

- `:CocCommand ecs.fix`

**If "ecs.enableActionProvider" is "true" (default: true)**:

- `:call CocAction('codeAction')` -> Choose action: "Run: ecs.fix"

**If "ecs.enableFormatProvider" is "true" (default: false)**:

- `:call CocAction('format')`

## Configuration options

- `ecs.enable`: Enable coc-ecs extension, default: `true`
- `ecs.toolPath`: The path to the ecs tool (Absolute path), default: `""`
- `ecs.useCache`: Use a cache file when fixing files, default: `true`
- `ecs.args`: Extra argumentos to `ecs` command

## Commands

- `ecs.fix`: Run ecs fix

## Code Actions

- `Run: ecs.fix`

## TIPS

### Using with other coc extensions

Run from "Code Action" or ":CocCommand" is recommended because it can be used together without any problem even if another coc extension provides the formatting.

- For example, [coc-intelephense](https://github.com/yaegassy/coc-intelephense) + [coc-ecs](https://github.com/yaegassy/coc-ecs)
- For example, [coc-phpls](https://github.com/marlonfan/coc-phpls) + [coc-ecs](https://github.com/yaegassy/coc-ecs)

### Equivalent to "organize imports"

The [intelephense](https://github.com/bmewburn/vscode-intelephense) does not currently support "organize imports".

You can add a configuration equivalent to "organize imports" in `ecs` to handle this.

**coc-settings.json**:

```jsonc
{
  // ...snip
  "ecs.args": "",
  // ...snip
}
```

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
