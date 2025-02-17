using System;

namespace Core.Entities.OrderAggregate;

public class PaymentSummary
{
    public int Last { get; set; }
    public required string Brand { get; set; }
    public int ExpMonth { get; set; }
    public int Year { get; set; }
}
