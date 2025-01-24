using Microsoft.EntityFrameworkCore;
using product_review_service.Models;

namespace product_review_service.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
    {
    }

    public DbSet<Review> Reviews { get; set; }
}