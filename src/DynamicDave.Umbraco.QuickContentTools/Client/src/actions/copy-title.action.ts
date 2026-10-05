import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { copyText, getTitle, runSafely } from '../helpers.js';

export class CopyTitleAction extends UmbEntityActionBase<never> {
  override async execute() {
    const unique = this.args.unique;
    if (!unique) return;
    await runSafely(this, async () => {
      await copyText(this, await getTitle(this, unique), 'ddQuickTools_noTitle');
    });
  }
}
export { CopyTitleAction as api };
