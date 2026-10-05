import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { getFrontendUrl, isHttpUrl, notify, runSafely } from '../helpers.js';

export class OpenFrontendAction extends UmbEntityActionBase<never> {
  override async execute() {
    const unique = this.args.unique;
    if (!unique) return;
    await runSafely(this, async () => {
      const url = await getFrontendUrl(this, unique);
      if (!url || !isHttpUrl(url)) {
        await notify(this, 'warning', 'ddQuickTools_noUrl');
        return;
      }
      window.location.href = url;
    });
  }
}
export { OpenFrontendAction as api };
