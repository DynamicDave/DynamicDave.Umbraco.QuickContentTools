import type {
  UmbEntryPointOnInit,
  UmbEntryPointOnUnload,
} from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { client } from "../api/client.gen.js";

// load up the manifests here
export const onInit: UmbEntryPointOnInit = async (host, _extensionRegistry) => {
  // Wire the generated API client into the backoffice auth context.
  // configureClient() sets baseUrl + credentials, attaches the auth callback
  // (cookie-based, with automatic token refresh) and binds the default
  // response interceptors (401 retry, error notifications, etc.).
  // The framework awaits onInit, so resolving the context here ensures the
  // client is fully configured before any element in this extension can use it.
  const authContext = await host.getContext(UMB_AUTH_CONTEXT);
  if (!authContext) {
    console.warn("UMB_AUTH_CONTEXT not available — extension API client will not be authenticated");
    return;
  }
  // configureClient() exists from Umbraco 17.3; on 17.0–17.2 set up the client from the OpenAPI configuration.
  if (typeof authContext.configureClient === "function") {
    authContext.configureClient(client);
    return;
  }
  const config = authContext.getOpenApiConfiguration();
  client.setConfig({
    baseUrl: config.base,
    credentials: config.credentials,
    auth: () => config.token(),
  });
};

export const onUnload: UmbEntryPointOnUnload = (_host, _extensionRegistry) => {
};
