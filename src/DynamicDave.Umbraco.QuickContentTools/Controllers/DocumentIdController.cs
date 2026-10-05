using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Actions;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Security.Authorization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Extensions;

namespace DynamicDave.Umbraco.QuickContentTools.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "DocumentId")]
public class DocumentIdController(IIdKeyMap idKeyMap, IAuthorizationService authorizationService) : DynamicDaveUmbracoQuickContentToolsApiControllerBase
{
    [HttpGet("document/{key:guid}/id", Name = "GetDocumentId")]
    [ProducesResponseType<DocumentIdModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDocumentId(Guid key)
    {
        // Same check as Umbraco's own document endpoints: start nodes and the Browse permission of the user's groups.
        var authorized = await authorizationService.AuthorizeResourceAsync(
            User,
            ContentPermissionResource.WithKeys(ActionBrowse.ActionLetter, key),
            AuthorizationPolicies.ContentPermissionByResource);
        if (!authorized.Succeeded) return StatusCode(StatusCodes.Status403Forbidden);

        var attempt = idKeyMap.GetIdForKey(key, UmbracoObjectTypes.Document);
        return attempt.Success ? Ok(new DocumentIdModel { Id = attempt.Result }) : NotFound();
    }
}

public sealed class DocumentIdModel
{
    public int Id { get; init; }
}
