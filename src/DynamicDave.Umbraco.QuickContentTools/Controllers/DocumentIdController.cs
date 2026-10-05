using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;

namespace DynamicDave.Umbraco.QuickContentTools.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "DocumentId")]
public class DocumentIdController(IIdKeyMap idKeyMap) : DynamicDaveUmbracoQuickContentToolsApiControllerBase
{
    [HttpGet("document/{key:guid}/id", Name = "GetDocumentId")]
    [ProducesResponseType<DocumentIdModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetDocumentId(Guid key)
    {
        var attempt = idKeyMap.GetIdForKey(key, UmbracoObjectTypes.Document);
        return attempt.Success ? Ok(new DocumentIdModel { Id = attempt.Result }) : NotFound();
    }
}

public sealed class DocumentIdModel
{
    public int Id { get; init; }
}
