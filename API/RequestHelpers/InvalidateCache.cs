using System;
using System.Runtime.CompilerServices;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace API.RequestHelpers;

[AttributeUsage(AttributeTargets.Method)]
public class InvalidateCache(string pattern) : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if (resultContext.Exception == null || resultContext.ExceptionHandled)
        {
            var cacheService = context.HttpContext.
            RequestServices.GetRequiredService<IResponseCacheService>();

            await cacheService.RemoveCacheByPattern(pattern);
        }
    }
}
