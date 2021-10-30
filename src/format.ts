import {
  DocumentFormattingEditProvider,
  Range,
  TextDocument,
  TextEdit,
  Uri,
  window,
  workspace,
  ExtensionContext,
  OutputChannel,
} from 'coc.nvim';

import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';

export async function doFormat(
  context: ExtensionContext,
  outputChannel: OutputChannel,
  document: TextDocument,
  range?: Range
): Promise<string> {
  if (document.languageId !== 'php') {
    throw 'ecs.fix cannot run, not a php file';
  }

  const extensionConfig = workspace.getConfiguration('ecs');

  const isUseCache = extensionConfig.get('useCache', false);
  const isAllowRisky = extensionConfig.get('allowRisky', true);
  let fixerConfig = extensionConfig.get('config', '');
  const fixerRules = extensionConfig.get('rules', '@PSR12');

  // 1. User setting ecs
  let toolPath = extensionConfig.get('toolPath', '');
  if (!toolPath) {
    if (fs.existsSync(path.join('vendor', 'bin', 'ecs'))) {
      // 2. vendor/bin/ecs
      toolPath = path.join('vendor', 'bin', 'ecs');
    } else if (fs.existsSync(path.join(context.storagePath, 'ecs'))) {
      // 3. builtin ecs
      toolPath = path.join(context.storagePath, 'ecs');
    } else {
      throw 'Unable to find the ecs tool.';
    }
  }

  const text = document.getText(range);
  const args: string[] = [];
  const cwd = Uri.file(workspace.root).fsPath;
  // Use shell
  const opts = { cwd, shell: true };

  args.push(toolPath);
  args.push('check');
  args.push('--fix');

  if (!isUseCache) {
    args.push('--clear-cache');
  }

  if (isAllowRisky) {
    //args.push('--allow-risky=yes');
  }

  /*
  if (fixerConfig) {
    if (!path.isAbsolute(fixerConfig)) {
      let currentPath = opts.cwd;
      const triedPaths = [currentPath];
      while (!fs.existsSync(currentPath + path.sep + fixerConfig)) {
        const lastPath = currentPath;
        currentPath = path.dirname(currentPath);
        if (lastPath == currentPath) {
          window.showErrorMessage(`Unable to find ${fixerConfig} file in ${triedPaths.join(', ')}`);
          return '';
        } else {
          triedPaths.push(currentPath);
        }
      }
      fixerConfig = currentPath + path.sep + fixerConfig;
    }

    args.push('--config=' + fixerConfig);
  } else {
    if (fixerRules) {
      //args.push('--rules=' + fixerRules);
    }
  }
  */

  const tmpFile = tmp.fileSync();
  fs.writeFileSync(tmpFile.name, text);

  // ---- Output the command to be executed to channel log. ----
  outputChannel.appendLine(`${'#'.repeat(10)} ecs\n`);
  outputChannel.appendLine(`Run: php ${args.join(' ')} ${tmpFile.name}`);
  outputChannel.appendLine(`Cwd: ${cwd}\n`);

  return new Promise(function (resolve) {
    cp.execFile('php', [...args, tmpFile.name], opts, function (err) {
      if (err) {
        tmpFile.removeCallback();

        window.showErrorMessage('Hola.');
        if (err.code === 'ENOENT') {
          window.showErrorMessage('Unable to find the ecs tool.');
          throw err;
        }

        window.showErrorMessage(
          'There was an error while running ecs. Check the Developer Tools console for more information.'
        );
        throw err;
      }

      const text = fs.readFileSync(tmpFile.name, 'utf-8');
      tmpFile.removeCallback();

      resolve(text);
    });
  });
}

export function fullDocumentRange(document: TextDocument): Range {
  const lastLineId = document.lineCount - 1;
  const doc = workspace.getDocument(document.uri);

  return Range.create({ character: 0, line: 0 }, { character: doc.getline(lastLineId).length, line: lastLineId });
}

class FixerFormattingEditProvider implements DocumentFormattingEditProvider {
  public _context: ExtensionContext;
  public _outputChannel: OutputChannel;

  constructor(context: ExtensionContext, outputChannel: OutputChannel) {
    this._context = context;
    this._outputChannel = outputChannel;
  }

  public provideDocumentFormattingEdits(document: TextDocument): Promise<TextEdit[]> {
    return this._provideEdits(document, undefined);
  }

  private async _provideEdits(document: TextDocument, range?: Range): Promise<TextEdit[]> {
    const code = await doFormat(this._context, this._outputChannel, document, range);
    if (!range) {
      range = fullDocumentRange(document);
    }
    return [TextEdit.replace(range, code)];
  }
}

export default FixerFormattingEditProvider;
