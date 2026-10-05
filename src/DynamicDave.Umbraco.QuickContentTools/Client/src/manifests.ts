// Vite cannot bundle template-literal dynamic imports, so each action is imported with a literal path.
type UmbEntityActionManifestApi = () => Promise<any>;

const action = (alias: string, api: UmbEntityActionManifestApi, labelKey: string, icon: string, weight: number): UmbExtensionManifest => ({
  type: 'entityAction',
  kind: 'default',
  alias: `DynamicDave.QuickContentTools.${alias}`,
  name: `Quick Content Tools: ${alias}`,
  api,
  forEntityTypes: ['document'],
  weight,
  conditions: [{ alias: 'Umb.Condition.EntityIsNotTrashed' }],
  meta: { icon, label: `#ddQuickTools_${labelKey}` },
});

export const manifests: Array<UmbExtensionManifest> = [
  action('CopyUrl', () => import('./actions/copy-url.action.js'), 'copyUrl', 'icon-link', 900),
  action('CopyRelativeUrl', () => import('./actions/copy-relative-url.action.js'), 'copyRelativeUrl', 'icon-link', 890),
  action('CopyKey', () => import('./actions/copy-key.action.js'), 'copyKey', 'icon-fingerprint', 880),
  action('CopyNodeId', () => import('./actions/copy-node-id.action.js'), 'copyNodeId', 'icon-binarycode', 870),
  action('CopyTitle', () => import('./actions/copy-title.action.js'), 'copyTitle', 'icon-font', 860),
  action('CopyBackofficeUrl', () => import('./actions/copy-backoffice-url.action.js'), 'copyBackofficeUrl', 'icon-window-popin', 850),
  action('OpenFrontend', () => import('./actions/open-frontend.action.js'), 'openFrontend', 'icon-globe', 840),
  action('OpenFrontendNewTab', () => import('./actions/open-frontend-new-tab.action.js'), 'openFrontendNewTab', 'icon-out', 830),
  {
    type: 'localization',
    alias: 'DynamicDave.QuickContentTools.Localization.En',
    name: 'Quick Content Tools English',
    weight: -100,
    meta: { culture: 'en' },
    js: () => import('./localization/en.js'),
  },
  {
    type: 'localization',
    alias: 'DynamicDave.QuickContentTools.Localization.Nl',
    name: 'Quick Content Tools Dutch',
    weight: -100,
    meta: { culture: 'nl' },
    js: () => import('./localization/nl.js'),
  },
  {
    type: 'localization',
    alias: 'DynamicDave.QuickContentTools.Localization.De',
    name: 'Quick Content Tools German',
    weight: -100,
    meta: { culture: 'de' },
    js: () => import('./localization/de.js'),
  },
  {
    type: 'localization',
    alias: 'DynamicDave.QuickContentTools.Localization.Fr',
    name: 'Quick Content Tools French',
    weight: -100,
    meta: { culture: 'fr' },
    js: () => import('./localization/fr.js'),
  },
  {
    type: 'localization',
    alias: 'DynamicDave.QuickContentTools.Localization.Da',
    name: 'Quick Content Tools Danish',
    weight: -100,
    meta: { culture: 'da' },
    js: () => import('./localization/da.js'),
  },
];
