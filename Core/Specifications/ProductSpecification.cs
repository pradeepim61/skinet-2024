using Core.Entities;

namespace Core.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification(ProductSpecParameters specParams) : base(x=> 
        (string.IsNullOrWhiteSpace(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
        (specParams.Brands.Count == 0 || specParams.Brands.Contains(x.Brand)) && 
        (specParams.Types.Count == 0 || specParams.Types.Contains(x.Type))
    )
    {
        ApplyPaging(specParams.PageSize * (specParams.PageIndex -1), specParams.PageSize);

        switch(specParams.Sort)
        {
            case "priceASC" :
                AddOrderBy(x=> x.Price);
                break;
            case "priceDESC" :
                AddOrderByDescending(x=> x.Price);
                break;
            default :
                AddOrderBy(x=> x.Name);
                break;
        }    

    }
}
