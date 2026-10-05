import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { copyText, getNodeId, runSafely } from '../helpers.js';

export class CopyNodeIdAction extends UmbEntityActionBase<never> {
  override async execute() {
    const unique = this.args.unique;
    if (!unique) return;
    await runSafely(this, async () => {
      const id = await getNodeId(unique);
      await copyText(this, id === undefined ? undefined : String(id));
    });
  }
}
export { CopyNodeIdAction as api };
