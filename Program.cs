using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// OPTIMIZATION: Enable CORS so the frontend can communicate with the backend seamlessly
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowAll");

// DATA STRUCTURE: Simulating a database with a static list
var inventory = new List<InventoryItem>
{
    new InventoryItem { Id = 1, Name = "Laptop", Quantity = 10, Price = 999.99m },
    new InventoryItem { Id = 2, Name = "Wireless Mouse", Quantity = 50, Price = 25.50m },
    new InventoryItem { Id = 3, Name = "Monitor 4K", Quantity = 15, Price = 300.00m },
    new InventoryItem { Id = 4, Name = "Mechanical Keyboard", Quantity = 20, Price = 85.00m }
};

// --- API ENDPOINTS ---

// GET: Retrieve all items (Optimized with basic response)
app.MapGet("/api/inventory", () => 
{
    return Results.Ok(inventory);
});

// POST: Add a new item (Integration Logic)
app.MapPost("/api/inventory", (InventoryItem newItem) => 
{
    newItem.Id = inventory.Max(i => i.Id) + 1;
    inventory.Add(newItem);
    return Results.Created($"/api/inventory/{newItem.Id}", newItem);
});

app.Run();

// JSON STRUCTURE: The Data Model
public class InventoryItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}
