using System.Security.Claims;
using DynamicDave.Umbraco.QuickContentTools.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Xunit;

namespace DynamicDave.Umbraco.QuickContentTools.Tests;

public class DocumentIdControllerTests
{
    private static DocumentIdController CreateController(IIdKeyMap idKeyMap, bool authorized)
    {
        var authorizationService = Substitute.For<IAuthorizationService>();
        authorizationService.AuthorizeAsync(Arg.Any<ClaimsPrincipal>(), Arg.Any<object?>(), Arg.Any<string>())
            .Returns(authorized ? AuthorizationResult.Success() : AuthorizationResult.Failed());

        return new DocumentIdController(idKeyMap, authorizationService)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() },
        };
    }

    [Fact]
    public async Task Known_key_returns_ok_with_id()
    {
        var key = Guid.NewGuid();
        var idKeyMap = Substitute.For<IIdKeyMap>();
        idKeyMap.GetIdForKey(key, UmbracoObjectTypes.Document).Returns(Attempt<int>.Succeed(1059));
        var controller = CreateController(idKeyMap, authorized: true);

        var result = await controller.GetDocumentId(key);

        var ok = Assert.IsType<OkObjectResult>(result);
        var model = Assert.IsType<DocumentIdModel>(ok.Value);
        Assert.Equal(1059, model.Id);
    }

    [Fact]
    public async Task Unknown_key_returns_not_found()
    {
        var key = Guid.NewGuid();
        var idKeyMap = Substitute.For<IIdKeyMap>();
        idKeyMap.GetIdForKey(key, UmbracoObjectTypes.Document).Returns(Attempt<int>.Fail());
        var controller = CreateController(idKeyMap, authorized: true);

        var result = await controller.GetDocumentId(key);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Document_without_browse_access_returns_forbidden()
    {
        var key = Guid.NewGuid();
        var idKeyMap = Substitute.For<IIdKeyMap>();
        idKeyMap.GetIdForKey(key, UmbracoObjectTypes.Document).Returns(Attempt<int>.Succeed(1059));
        var controller = CreateController(idKeyMap, authorized: false);

        var result = await controller.GetDocumentId(key);

        var status = Assert.IsType<StatusCodeResult>(result);
        Assert.Equal(StatusCodes.Status403Forbidden, status.StatusCode);
        idKeyMap.DidNotReceiveWithAnyArgs().GetIdForKey(default, default);
    }
}
