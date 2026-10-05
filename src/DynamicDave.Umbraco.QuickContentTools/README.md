# DynamicDave.Umbraco.QuickContentTools

Adds quick entity actions to documents (the actions menu in the content tree and workspace): copy URL, copy relative URL, copy content key (GUID), copy node ID (the ID is shown in the menu label), copy page title, copy backoffice URL, and open frontend in a new tab.

## Install

    dotnet add package DynamicDave.Umbraco.QuickContentTools

Supported Umbraco version: **17.x** (net10.0). The backoffice UI is available in English, Dutch, German, French and Danish.

## Configuration

None.

## Notes

- The node ID endpoint requires Content-section access but does not check per-document (start-node) permissions.

- The URL and title follow the culture of the backoffice app language.
- When a page has no URL (for example because it is not published), the URL actions show a warning notification instead of copying.

## License

MIT
