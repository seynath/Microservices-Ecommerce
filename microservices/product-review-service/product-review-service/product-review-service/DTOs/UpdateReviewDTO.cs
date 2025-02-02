namespace product_review_service.DTOs;

public class UpdateReviewDTO
{
    public Guid Id { get; set; }
    public string? ProductId { get; set; } // Foreign Key
    public int? UserId { get; set; } // Foreign Key
    public required int Rating { get; set; } // Rating (1-5)
    public required string ReviewText { get; set; } // Optional review text
}