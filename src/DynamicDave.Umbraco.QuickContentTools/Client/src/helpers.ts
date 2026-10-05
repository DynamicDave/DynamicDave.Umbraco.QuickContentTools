import type { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';
import { UMB_APP_LANGUAGE_CONTEXT } from '@umbraco-cms/backoffice/language';
import { UmbDocumentUrlRepository, UmbDocumentItemRepository } from '@umbraco-cms/backoffice/document';
import { UmbLocalizationController } from '@umbraco-cms/backoffice/localization-api';
import { DocumentIdService } from './api/index.js';

export async function notify(host: UmbControllerBase, color: 'positive' | 'warning' | 'danger', key: string) {
  const ctx = await host.getContext(UMB_NOTIFICATION_CONTEXT);
  ctx?.peek(color, { data: { message: new UmbLocalizationController(host).string(`#${key}`) } });
}

/** Runs an action body; any failure becomes the localized "failed" notification instead of an unhandled rejection. */
export async function runSafely(host: UmbControllerBase, body: () => Promise<void>) {
  try {
    await body();
  } catch (error) {
    console.error('Quick Content Tools action failed', error);
    try {
      await notify(host, 'danger', 'ddQuickTools_failed');
    } catch {
      // nothing more we can do
    }
  }
}

/**
 * Copies text to the clipboard. Empty text shows `emptyKey` as a warning.
 * A successful copy is never reported as a failure just because the notification step fails.
 */
export async function copyText(host: UmbControllerBase, text: string | undefined, emptyKey = 'ddQuickTools_noUrl') {
  if (!text) {
    await notify(host, 'warning', emptyKey);
    return;
  }
  try {
    if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Quick Content Tools: clipboard write failed', error);
    await notify(host, 'warning', 'ddQuickTools_clipboardUnavailable');
    return;
  }
  try {
    await notify(host, 'positive', 'ddQuickTools_copied');
  } catch {
    // the copy itself succeeded
  }
}

const sameCulture = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

async function getAppCulture(host: UmbControllerBase): Promise<string | undefined> {
  const ctx = await host.getContext(UMB_APP_LANGUAGE_CONTEXT);
  return ctx?.getAppCulture();
}

/** Absolute (or relative) URL for the active culture, else the first URL variant; undefined when the page has none. */
export async function getFrontendUrl(host: UmbControllerBase, unique: string, relative = false): Promise<string | undefined> {
  const repo = new UmbDocumentUrlRepository(host);
  const { data, error } = await repo.requestItems([unique]);
  if (error) throw new Error('Could not load document URLs');
  const urls = data?.[0]?.urls ?? [];
  const culture = await getAppCulture(host);
  const url = (urls.find((u) => !!u.url && sameCulture(u.culture, culture)) ?? urls.find((u) => !!u.url))?.url;
  if (!url) return undefined;
  if (!relative) return url.startsWith('/') ? `${window.location.origin}${url}` : url;
  return url.startsWith('/') ? url : new URL(url).pathname;
}

/** True only for http(s) URLs (absolute) — guards navigation against other schemes. */
export function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Name of the variant for the active culture, else the first variant. */
export async function getTitle(host: UmbControllerBase, unique: string): Promise<string | undefined> {
  const repo = new UmbDocumentItemRepository(host);
  const { data, error } = await repo.requestItems([unique]);
  if (error) throw new Error('Could not load document');
  const variants = data?.[0]?.variants ?? [];
  const culture = await getAppCulture(host);
  return (variants.find((v) => sameCulture(v.culture, culture)) ?? variants[0])?.name;
}

// A node's integer id never changes, so the menu label and the copy action share one lookup per key.
const nodeIdCache = new Map<string, number>();

/** Looks up the legacy integer node id; throws when the API call fails (404 or error) so the caller shows "failed". */
export async function getNodeId(unique: string): Promise<number | undefined> {
  const cached = nodeIdCache.get(unique);
  if (cached !== undefined) return cached;
  const response = await DocumentIdService.getDocumentId({ path: { key: unique } });
  if (response.error !== undefined && response.error !== null) {
    throw new Error('GetDocumentId failed');
  }
  const id = (response.data as { id: number } | undefined)?.id;
  if (id !== undefined) nodeIdCache.set(unique, id);
  return id;
}

export function getBackofficeUrl(unique: string): string {
  return `${window.location.origin}/umbraco/section/content/workspace/document/edit/${unique}`;
}
