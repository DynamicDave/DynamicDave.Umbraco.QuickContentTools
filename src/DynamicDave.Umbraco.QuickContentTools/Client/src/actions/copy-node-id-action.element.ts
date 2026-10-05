import { html, nothing, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbActionExecutedEvent } from '@umbraco-cms/backoffice/event';
import type { ManifestEntityActionDefaultKind, UmbEntityAction } from '@umbraco-cms/backoffice/entity-action';
import { getNodeId } from '../helpers.js';

/**
 * Menu item for "Copy node ID" that shows the id in its label, e.g. "Copy node ID (1234)".
 * Mirrors Umbraco's default entity action element, which only supports a static label.
 */
@customElement('dd-quick-tools-copy-node-id-action')
export class CopyNodeIdActionElement extends UmbLitElement {
  @property({ type: String })
  entityType?: string;

  @property({ attribute: false })
  manifest?: ManifestEntityActionDefaultKind;

  @property({ attribute: false })
  api?: UmbEntityAction<never>;

  @state()
  private _nodeId?: number;

  #unique?: string | null;

  @property({ type: String })
  get unique() {
    return this.#unique;
  }
  set unique(value: string | null | undefined) {
    if (value === this.#unique) return;
    this.#unique = value;
    this._nodeId = undefined;
    if (value) this.#loadNodeId(value);
  }

  async #loadNodeId(unique: string) {
    try {
      const id = await getNodeId(unique);
      if (unique === this.#unique) this._nodeId = id;
    } catch {
      // keep the plain label; the action itself reports failures when clicked
    }
  }

  override async focus() {
    await this.updateComplete;
    this.shadowRoot?.querySelector('uui-menu-item')?.focus();
  }

  async #onClickLabel(event: Event) {
    event.stopPropagation();
    try {
      await this.api?.execute();
      this.dispatchEvent(new UmbActionExecutedEvent());
    } catch (error) {
      console.error('Error executing action:', error);
    }
  }

  // Keep the click from reaching e.g. a table row behind the menu (same as the default element).
  #onClick(event: Event) {
    event.stopPropagation();
  }

  override render() {
    if (!this.manifest) return nothing;
    const base = this.manifest.meta.label ? this.localize.string(this.manifest.meta.label) : this.manifest.name;
    const label = this._nodeId === undefined ? base : `${base} (${this._nodeId})`;
    return html`
      <uui-menu-item
        data-mark=${'entity-action:' + this.manifest.alias}
        label=${label}
        @click-label=${this.#onClickLabel}
        @click=${this.#onClick}>
        ${this.manifest.meta.icon ? html`<umb-icon slot="icon" name=${this.manifest.meta.icon}></umb-icon>` : nothing}
      </uui-menu-item>
    `;
  }
}

export default CopyNodeIdActionElement;

declare global {
  interface HTMLElementTagNameMap {
    'dd-quick-tools-copy-node-id-action': CopyNodeIdActionElement;
  }
}
