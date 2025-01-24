using Microsoft.AspNetCore.Mvc;
using product_review_service.Data;
using product_review_service.DTOs;
using product_review_service.Models;

namespace product_review_service.Controllers;

[Route("api/reviews")]
[ApiController]

 
public class ReviewController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    
    public ReviewController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    

    [HttpGet]
    public IActionResult GetAllReviews()
    {
        var allReviews = _dbContext.Reviews.ToList();
        return Ok(allReviews);
    }
    

    [HttpPost]
    public IActionResult AddReview(AddReviewDTO addReviewDto)
    {
        var reviewEntity = new Review()
        {
            ProductId = addReviewDto.ProductId,
            UserId = addReviewDto.UserId,
            Rating = addReviewDto.Rating,
            ReviewText = addReviewDto.ReviewText,


        };
        _dbContext.Reviews.Add(reviewEntity);
        _dbContext.SaveChanges();
        return Ok(reviewEntity);
                
    }
    
        
        
    
}