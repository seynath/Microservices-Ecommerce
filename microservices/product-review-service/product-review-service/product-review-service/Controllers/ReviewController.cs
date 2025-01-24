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

    [HttpGet]
    // [Route("{id:guid}")]
    [Route("{productId}")]
    public IActionResult GetReview(string productId)
    {
        // how to find using productId
        var review = _dbContext.Reviews.FirstOrDefault(r => r.ProductId == productId);
        if (review is null)
        {
            return NotFound();
            
        }
        return Ok(review);
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
    
    [HttpPut]
    // [Route("{id:guid}")]
    public IActionResult UpdateReview( [FromBody] UpdateReviewDTO updateReviewDto)
    {
        // Console.WriteLine("/////////////////////////////////////////////");
        // Console.WriteLine(updateReviewDto.ProductId);
        // Console.WriteLine("/////////////////////////////////////////////");
        var review = _dbContext.Reviews.Find(updateReviewDto.Id);
        Console.WriteLine(review);
        if (review is null)
        {
            return NotFound();
        }
        review.Rating = updateReviewDto.Rating;
        review.ReviewText = updateReviewDto.ReviewText;
        _dbContext.SaveChanges();
        return Ok(review);

        // return NotFound();
    }
    
    [HttpDelete]
    [Route("{id:guid}")]
    public IActionResult DeleteReview(Guid id)
    {
        var review = _dbContext.Reviews.Find(id);
        if (review is null)
        {
            return NotFound();
        }
        _dbContext.Reviews.Remove(review);
        _dbContext.SaveChanges();
        return Ok();
    }
    
    
        
        
    
}