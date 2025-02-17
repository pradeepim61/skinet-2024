using System;
using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class AddressMappingExtensions
{
    public static AddressDto? ToDto(this Address? address)
    {
        if (address == null) return null;

        return new AddressDto
        {
            Line1 = address.Line1,
            Line2 = address.Line2,
            State = address.State,
            Country = address.Country,
            City = address.City,
            PostalCode = address.PostalCode,

        };
    }

    public static Address ToEntity(this AddressDto addressDto)
    {
        if (addressDto == null) throw new ArgumentNullException(nameof(addressDto));

        return new Address
        {
            Line1 = addressDto.Line1,
            Line2 = addressDto.Line2,
            State = addressDto.State,
            Country = addressDto.Country,
            City = addressDto.City,
            PostalCode = addressDto.PostalCode,
        };
    }

    public static void UpdateFromDto(this Address address, AddressDto addressDto)
    {
        if (addressDto == null) throw new ArgumentNullException(nameof(addressDto));
        if (address == null) throw new ArgumentNullException(nameof(address));

        address.Line1 = addressDto.Line1;
        address.Line2 = addressDto.Line2;
        address.State = addressDto.State;
        address.Country = addressDto.Country;
        address.City = addressDto.City;
        address.PostalCode = addressDto.PostalCode;

    }

}
