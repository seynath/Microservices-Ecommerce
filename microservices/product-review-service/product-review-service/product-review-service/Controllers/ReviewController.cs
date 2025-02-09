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
    private readonly HttpClient _httpClient;
    
    public ReviewController(ApplicationDbContext dbContext, HttpClient httpClient)
    {
        _dbContext = dbContext;
        _httpClient = httpClient;
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
    // [Route("{orderId}")]
    public async Task<IActionResult> AddReview([FromBody]AddReviewDTO addReviewDto)
    {
        Console.WriteLine("/////////////////////////////////////////////");
        Console.WriteLine(addReviewDto.OrderId);
        Console.WriteLine("/////////////////////////////////////////////");
        var orderServiceUrl = $"http://127.0.0.1:8000/order/order_id/{addReviewDto.OrderId}";

        try
        {
        var response = await _httpClient.GetAsync(orderServiceUrl);
        Console.WriteLine((object)response);

        if (!response.IsSuccessStatusCode)
        {
            return BadRequest(new { message = response.ReasonPhrase });
        }
        
        var reviewEntity = new Review()
        {
            ProductId = addReviewDto.ProductId,
            UserId = addReviewDto.UserId,
            Rating = addReviewDto.Rating,
            ReviewText = addReviewDto.ReviewText,
        
        
        };
        _dbContext.Reviews.Add(reviewEntity);
        // _dbContext.SaveChanges();
        int changes =  await _dbContext.SaveChangesAsync();

        if (changes > 0)
        {
            // await UpdateReviewOnProductService(reviewEntity);
            var productServiceUrl = $"http://localhost:6003/product/update_rating";
            var productServiceRequest = new
            {
                product_id = reviewEntity.ProductId,
                rating = reviewEntity.Rating
            };
        
            try
            {
                var productResponse = await _httpClient.PutAsJsonAsync(productServiceUrl, productServiceRequest);
                return !productResponse.IsSuccessStatusCode ? StatusCode(500, new { message = "Internal Server Error in Product Service" }) : Ok(reviewEntity);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return StatusCode(500, new { message = "Internal Server Error in Product Service" });
            }
            
        }
        
        return Ok(reviewEntity);

        }catch(Exception e)
        {
         
            // return BadRequest(new { message = e.Message });
            return StatusCode(500, new { message = "Internal Server Error" });
        }
        
    }
    
    //method to update review on product service
    [NonAction]
    public async Task<bool> UpdateReviewOnProductService(Review review)
    {
        var productServiceUrl = $"http://localhost:6003/product/update_rating";
        var productServiceRequest = new
        {
            product_id = review.ProductId,
            rating = review.Rating
        };
        
        try
        {
            var response = await _httpClient.PutAsJsonAsync(productServiceUrl, productServiceRequest);
            return response.IsSuccessStatusCode;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // [HttpPut]
    // [Route("{id}")]
    // public IActionResult UpdateReview( [FromBody] UpdateReviewDTO updateReviewDto)
    // {
    //     // Console.WriteLine("/////////////////////////////////////////////");
    //     // Console.WriteLine(updateReviewDto.ProductId);
    //     // Console.WriteLine("/////////////////////////////////////////////");
    //     var review = _dbContext.Reviews.Find(updateReviewDto.Id);
    //     Console.WriteLine(review);
    //     if (review is null)
    //     {
    //         return NotFound();
    //     }
    //     review.Rating = updateReviewDto.Rating;
    //     review.ReviewText = updateReviewDto.ReviewText;
    //     _dbContext.SaveChanges();
    //     
    //     //update the review in the order service
    //     var orderServiceUrl = $"http://localhost:8000/order/update_rating";
    //     var orderServiceRequest = new
    //     {
    //         order_id = review.OrderId,
    //         product_id = review.ProductId,
    //         Rating = review.Rating
    //     };
    //     return Ok(review);
    //
    //     // return NotFound();
    // }
    //
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