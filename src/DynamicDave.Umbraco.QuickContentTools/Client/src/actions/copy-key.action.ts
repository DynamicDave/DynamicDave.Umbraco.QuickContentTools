import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { copyText, runSafely } from '../helpers.js';

export class CopyKeyAction extends UmbEntityActionBase<never> {
  override async execute() {
    const unique = this.args.unique;
    if (!unique) return;
    await runSafely(this, async () => {
      await copyText(this, unique);
    });
  }
}
export { CopyKeyAction as api };
