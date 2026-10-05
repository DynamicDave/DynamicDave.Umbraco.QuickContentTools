import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { copyText, getBackofficeUrl, runSafely } from '../helpers.js';

export class CopyBackofficeUrlAction extends UmbEntityActionBase<never> {
  override async execute() {
    const unique = this.args.unique;
    if (!unique) return;
    await runSafely(this, async () => {
      await copyText(this, getBackofficeUrl(unique));
    });
  }
}
export { CopyBackofficeUrlAction as api };
