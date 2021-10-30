import {
  TextEdit,
  workspace,
  commands,
  ExtensionContext,
  languages,
  Disposable,
  DocumentSelector,
  window,
} from 'coc.nvim';
import fs from 'fs';
import path from 'path';

import { doFormat, fullDocumentRange } from './format';
import { FixerCodeActionProvider } from './action';

let formatterHandler: undefined | Disposable;

function disposeHandlers(): void {
  if (formatterHandler) {
    formatterHandler.dispose();
  }
  formatterHandler = undefined;
}

export async function activate(context: ExtensionContext): Promise<void> {
  const extensionConfig = workspace.getConfiguration('ecs');
  const isEnable = extensionConfig.get<boolean>('enable', true);
  if (!isEnable) return;

  const isEnableActionProvider = extensionConfig.get<boolean>('enableActionProvider', true);

  const outputChannel = window.createOutputChannel('ecs');

  const extensionStoragePath = context.storagePath;
  if (!fs.existsSync(extensionStoragePath)) {
    fs.mkdirSync(extensionStoragePath);
  }

  let toolPath = extensionConfig.get('toolPath', '');
  if (!toolPath) {
    if (fs.existsSync(path.join('vendor', 'bin', 'ecs'))) {
      toolPath = path.join('vendor', 'bin', 'ecs');
    } else if (fs.existsSync(path.join(context.storagePath, 'ecs'))) {
      toolPath = path.join(context.storagePath, 'ecs');
    }
  }

  if (!toolPath) {
    window.showMessage('ecs command not found', 'error');
  }

  const actionProvider = new FixerCodeActionProvider();
  const languageSelector: DocumentSelector = [{ language: 'php', scheme: 'file' }];

  function registerFormatter(): void {
    disposeHandlers();
  }
  registerFormatter();

  context.subscriptions.push(
    commands.registerCommand('ecs.fix', async () => {
      const doc = await workspace.document;

      const code = await doFormat(context, outputChannel, doc.textDocument, undefined);
      const edits = [TextEdit.replace(fullDocumentRange(doc.textDocument), code)];
      if (edits) {
        await doc.applyEdits(edits);
      }
    })
  );

  if (isEnableActionProvider) {
    context.subscriptions.push(languages.registerCodeActionProvider(languageSelector, actionProvider, 'ecs'));
  }
}
