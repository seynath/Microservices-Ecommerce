namespace product_review_service.DTOs;

public class AddReviewDTO
{
    public required string  ProductId { get; set; } // Foreign Key
    public required string UserId { get; set; } // Foreign Key
    public required int Rating { get; set; } // Rating (1-5)
    public required string ReviewText { get; set; } // Optional review text
}