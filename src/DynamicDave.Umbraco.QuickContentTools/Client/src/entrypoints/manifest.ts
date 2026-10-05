export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Dynamic Dave Umbraco Quick Content Tools Entrypoint",
    alias: "DynamicDave.Umbraco.QuickContentTools.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
