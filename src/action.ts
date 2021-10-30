import { TextDocument, CodeAction, CodeActionContext, CodeActionProvider, Range } from 'coc.nvim';

export class FixerCodeActionProvider implements CodeActionProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext) {
    const codeActions: CodeAction[] = [];

    const title = `Run: ecs.fix`;
    const command = {
      title: '',
      command: 'ecs.fix',
    };

    const action: CodeAction = {
      title,
      command,
    };

    codeActions.push(action);

    return codeActions;
  }
}
