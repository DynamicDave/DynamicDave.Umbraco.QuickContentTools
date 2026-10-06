// Registers the OpenAPI document for the package's backoffice API, used to generate the TypeScript client
// (`npm run generate-client` in the package's Client folder). It lives in the TestSite instead of the package:
// Umbraco 17 uses Swashbuckle and Umbraco 18 uses Microsoft.AspNetCore.OpenApi, and a single package that
// supports both cannot reference either one. UMBRACO_18 is defined by TestSite.csproj from the Umbraco version.
using DynamicDave.Umbraco.QuickContentTools;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Umbraco.Cms.Api.Common.OpenApi;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
#if !UMBRACO_18
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
#endif

namespace TestSite.OpenApi;

public class QuickContentToolsOpenApiComposer : IComposer
{
    private const string Title = "Dynamic Dave Umbraco Quick Content Tools Backoffice API";

    private static bool IsPackageAction(ActionDescriptor action) =>
        action is ControllerActionDescriptor controllerAction
        && controllerAction.ControllerTypeInfo.Namespace?.StartsWith("DynamicDave.Umbraco.QuickContentTools.Controllers", StringComparison.Ordinal) is true;

#if UMBRACO_18
    // Document: /umbraco/openapi/dynamicdave-quicktools.json
    public void Compose(IUmbracoBuilder builder) =>
        builder.AddBackOfficeOpenApiDocument(Constants.ApiName, document => document
            .WithTitle(Title)
            .WithBackOfficeAuthentication()
            .ConfigureOpenApiOptions(options => options.AddOperationTransformer((operation, context, _) =>
            {
                // Short operation IDs (the action name) give the generated TypeScript client short method names.
                if (IsPackageAction(context.Description.ActionDescriptor))
                {
                    operation.OperationId = context.Description.ActionDescriptor.RouteValues["action"];
                }
                return Task.CompletedTask;
            })));
#else
    // Document: /umbraco/swagger/dynamicdave-quicktools/swagger.json
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<IOperationIdHandler, ShortOperationIdHandler>();
        builder.Services.Configure<SwaggerGenOptions>(options =>
        {
            options.SwaggerDoc(Constants.ApiName, new OpenApiInfo { Title = Title, Version = "1.0" });
            options.OperationFilter<SecurityFilter>();
        });
    }

    private class SecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
    {
        protected override string ApiName => Constants.ApiName;
    }

    // Short operation IDs (the action name) give the generated TypeScript client short method names.
    private class ShortOperationIdHandler(IOptions<ApiVersioningOptions> apiVersioningOptions) : OperationIdHandler(apiVersioningOptions)
    {
        protected override bool CanHandle(ApiDescription apiDescription, ControllerActionDescriptor controllerActionDescriptor) =>
            IsPackageAction(controllerActionDescriptor);

        public override string Handle(ApiDescription apiDescription) => $"{apiDescription.ActionDescriptor.RouteValues["action"]}";
    }
#endif
}
