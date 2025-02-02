namespace product_review_service.Models;

public class Review
{
    public Guid Id { get; set; } // Primary Key
    public required string  ProductId { get; set; } // Foreign Key
    public required int UserId { get; set; } // Foreign Key
    public required int Rating { get; set; } // Rating (1-5)
    public required string ReviewText { get; set; } // Optional review text
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default timestamp
    public DateTime? UpdatedAt { get; set; } // Optional update timestamp
}

