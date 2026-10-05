using DynamicDave.Umbraco.QuickContentTools.Controllers;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Xunit;

namespace DynamicDave.Umbraco.QuickContentTools.Tests;

public class DocumentIdControllerTests
{
    [Fact]
    public void Known_key_returns_ok_with_id()
    {
        var key = Guid.NewGuid();
        var idKeyMap = Substitute.For<IIdKeyMap>();
        idKeyMap.GetIdForKey(key, UmbracoObjectTypes.Document).Returns(Attempt<int>.Succeed(1059));
        var controller = new DocumentIdController(idKeyMap);

        var result = controller.GetDocumentId(key);

        var ok = Assert.IsType<OkObjectResult>(result);
        var model = Assert.IsType<DocumentIdModel>(ok.Value);
        Assert.Equal(1059, model.Id);
    }

    [Fact]
    public void Unknown_key_returns_not_found()
    {
        var key = Guid.NewGuid();
        var idKeyMap = Substitute.For<IIdKeyMap>();
        idKeyMap.GetIdForKey(key, UmbracoObjectTypes.Document).Returns(Attempt<int>.Fail());
        var controller = new DocumentIdController(idKeyMap);

        var result = controller.GetDocumentId(key);

        Assert.IsType<NotFoundResult>(result);
    }
}
