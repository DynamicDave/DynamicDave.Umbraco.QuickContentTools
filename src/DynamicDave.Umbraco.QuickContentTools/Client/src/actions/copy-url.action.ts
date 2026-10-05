import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { copyText, getFrontendUrl, runSafely } from '../helpers.js';

export class CopyUrlAction extends UmbEntityActionBase<never> {
  override async execute() {
    const unique = this.args.unique;
    if (!unique) return;
    await runSafely(this, async () => {
      await copyText(this, await getFrontendUrl(this, unique));
    });
  }
}
export { CopyUrlAction as api };
