﻿using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IUnitOfWork unit) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts([FromQuery]ProductSpecParameters specParams)
    {
            var spec = new ProductSpecification(specParams);

            return Ok(await CreatedPagedResult(unit.Repository<Product>(), spec,specParams.PageIndex, specParams.PageSize));
    }

    [HttpGet("{id:int}")] 
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await  unit.Repository<Product>().GetByIdAsync(id);
        if(product == null) return NotFound();

        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        unit.Repository<Product>().Add(product);

        if(await unit.Complete())
        { 
            return CreatedAtAction("GetProduct", new {id = product.Id}, product );
        }
        return BadRequest("Problem creating Product");
    }
    
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if(product.Id != id || !ProductExists(id) )
            return BadRequest("Cannot update this product");

        unit.Repository<Product>().Update(product);
        if(await unit.Complete())
        {
            return NoContent();
        }
        return BadRequest("Problem updating the product");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
    var product = await unit.Repository<Product>().GetByIdAsync(id);

    if(product == null) return NotFound();
    unit.Repository<Product>().Remove(product);

    if(await unit.Complete())
        {
            return NoContent();
        }

        return BadRequest("Problem deleting the product");
    }
    
    [HttpGet("Brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();
        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }

    [HttpGet("Types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }

    private bool ProductExists(int id)
    {
        return unit.Repository<Product>().Exists(id);
    } 


}
