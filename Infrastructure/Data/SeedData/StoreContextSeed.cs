﻿using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsysnc(StoreContext context, UserManager<AppUser> userManager)
    {
        if (!userManager.Users.Any(x => x.UserName == "admin@test.com"))
        {
            var user = new AppUser
            {
                UserName = "admin@test.com",
                Email = "admin@test.com"
            };

            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Admin");

        }

        var user1 = await userManager.FindByEmailAsync("admin@test.com");

        if (user1 != null)
        {
            var isInRole = await userManager.IsInRoleAsync(user1, "Admin");

            if (!isInRole)
            {
                var result = await userManager.AddToRoleAsync(user1, "Admin");
                if (!result.Succeeded)
                {
                    Console.WriteLine($"Error: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }

        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.Products.Any())
        {
            var productsData = await File.ReadAllTextAsync(path + @"/Data/SeedData/products.json");

            var products = JsonSerializer.Deserialize<List<Product>>(productsData);

            if (products == null) return;
            context.Products.AddRange(products);

            await context.SaveChangesAsync();

        }

        if (!context.DeliveryMethods.Any())
        {
            var dmData = await File.ReadAllTextAsync(path + @"/Data/SeedData/delivery.json");

            var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);

            if (deliveryMethods == null) return;
            context.DeliveryMethods.AddRange(deliveryMethods);

            await context.SaveChangesAsync();

        }
    }
}
