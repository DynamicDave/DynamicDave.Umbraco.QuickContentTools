# DynamicDave.Umbraco.QuickContentTools

Copy and open actions (URL, relative URL, key, node ID, title, backoffice URL, open frontend) in the Umbraco content context menu.

The backoffice UI is localized in English, Dutch, German, French and Danish (`src/DynamicDave.Umbraco.QuickContentTools/Client/src/localization`).

Umbraco 17 backoffice package (`DynamicDave.Umbraco.QuickContentTools`). See [the package README](src/DynamicDave.Umbraco.QuickContentTools/README.md) for what it does, configuration and limitations.

## Prerequisites

- .NET 10 SDK
- Node.js 22+ and npm on PATH. `dotnet build` and `dotnet pack` run the Vite client build automatically (`npm ci` only when `src/DynamicDave.Umbraco.QuickContentTools/Client/node_modules` is missing, then `npm run build`; repeat builds are incremental). Skip it with `-p:SkipClientBuild=true` when the client output already exists.

## Develop

    dotnet build DynamicDave.Umbraco.QuickContentTools.slnx
    dotnet test DynamicDave.Umbraco.QuickContentTools.slnx
    dotnet run --project tests/TestSite

The `Umbraco.Web.UI` launch profile in `tests/TestSite/Properties/launchSettings.json` sets `ASPNETCORE_ENVIRONMENT=Development` and the ports, so the command above works in any shell. The first time you may need to trust the dev certificate (`dotnet dev-certs https --trust`).

Backoffice: https://localhost:44413/umbraco (use the https URL to log in). The test admin is configured in `tests/TestSite/appsettings.Development.json` (local development only). The TestSite creates its own SQLite database on first start; delete `tests/TestSite/umbraco/Data/Umbraco.sqlite.db*` to start over.

## Pack

    dotnet pack src/DynamicDave.Umbraco.QuickContentTools -c Release -o artifacts

## License

MIT, see [LICENSE](LICENSE).
