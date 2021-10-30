# coc-ecs

[PHP CS Fixer](https://github.com/FriendsOfPHP/ecs) (PHP Coding Standards Fixer) extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

## Install

`:CocInstall coc-ecs`

## Note

Detects the `ecs` command. They are prioritized in order from the top.

1. `ecs.toolPath`
1. `vendor/bin/ecs`
1. `ecs` retrieved by the download feature (`:CocCommand ecs.download`)
    - Mac/Linux: `~/.config/coc/extensions/coc-ecs-data/ecs`
    - Windows: `~/AppData/Local/coc/extensions/coc-ecs-data/ecs`

If "1" and "2" above are not detected, the download feature will be executed (The prompt will be displayed)

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
- `ecs.downloadMajorVersion`: Specify the major version of ecs to download for the extension, valid option `[2, 3]`, default: `3`
- `ecs.enableActionProvider`: Enable codeAction provider, default: `true`
- `ecs.enableFormatProvider`: Enable format provider, default: `false`
- `ecs.toolPath`: The path to the ecs tool (Absolute path), default: `""`
- `ecs.useCache`: Use a cache file when fixing files (--using-cache), default: `false`
- `ecs.allowRisky`: Determines whether risky rules are allowed (--allow-risky), default: `false`
- `ecs.config`: Path to a `.php_cs` or `.ecs.php` file (--config), default: `""`
- `ecs.rules`: Rules to use when fixing files (--rules), e.g. `"@PSR12,@Symfony"`, default: `"@PSR12"`

## Commands

- `ecs.fix`: Run ecs fix
- `ecs.download`: Download ecs
   - By default, the "v3" series will be downloaded. If you want to download "v2" series, please change the `ecs.downloadMajorVersion` setting.

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
  "ecs.rules": "@PSR12,ordered_imports,no_unused_imports",
  // ...snip
}
```

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
