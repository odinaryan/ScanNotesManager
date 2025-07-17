using ScanNotesManager.Backend.Services;
using ScanNotesManager.Backend.DTOs;
using ScanNotesManager.Backend.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Configure URLs to use port 8080
builder.WebHost.UseUrls("http://+:8080");

// Validation is handled by the built-in DataAnnotations

// Register our service as a singleton (in-memory storage)
builder.Services.AddSingleton<IScanService, ScanService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseCors();

// Global error handling middleware
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        // Log the error (in production, use proper logging)
        Console.WriteLine($"Unhandled exception: {ex}");
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        
        var errorResponse = new
        {
            message = "An internal server error occurred",
            statusCode = 500,
            detail = app.Environment.IsDevelopment() ? ex.Message : null
        };
        
        var json = JsonSerializer.Serialize(errorResponse);
        await context.Response.WriteAsync(json);
    }
});

// Helper method for validation
static bool TryValidateModel<T>(T model, out List<string> errors)
{
    errors = new List<string>();
    var context = new ValidationContext(model!);
    var results = new List<ValidationResult>();
    
    bool isValid = Validator.TryValidateObject(model!, context, results, true);
    
    if (!isValid)
    {
        errors.AddRange(results.Select(r => r.ErrorMessage ?? "Validation error"));
    }
    
    return isValid;
}

// API Endpoints

// GET /api/scans - Get all scans
app.MapGet("/api/scans", async (IScanService scanService) =>
{
    var scans = await scanService.GetAllScansAsync();
    var scanDtos = scans.Select(scan => new ScanDto
    {
        Id = scan.Id,
        PatientName = scan.PatientName,
        ScanDate = scan.ScanDate,
        ScanType = scan.ScanType
    }).ToList();
    
    return Results.Ok(scanDtos);
})
.WithName("GetScans");

// GET /api/scans/{id}/notes - Get notes for a specific scan
app.MapGet("/api/scans/{id}/notes", async (int id, IScanService scanService) =>
{
    var scan = await scanService.GetScanByIdAsync(id);
    if (scan == null)
    {
        return Results.NotFound(new { 
            message = $"Scan with ID {id} not found",
            statusCode = 404 
        });
    }

    var notes = await scanService.GetNotesByScanIdAsync(id);
    var noteDtos = notes.Select(note => new NoteDto
    {
        Id = note.Id,
        Title = note.Title,
        Content = note.Content,
        CreatedAt = note.CreatedAt,
        ScanId = note.ScanId
    }).ToList();
    
    return Results.Ok(noteDtos);
})
.WithName("GetNotesByScan");

// POST /api/scans/{id}/notes - Add a note to a scan
app.MapPost("/api/scans/{id}/notes", async (int id, CreateNoteDto createNoteDto, IScanService scanService) =>
{
    // Validate the model
    if (!TryValidateModel(createNoteDto, out var validationErrors))
    {
        return Results.BadRequest(new { 
            message = "Validation failed",
            errors = validationErrors,
            statusCode = 400
        });
    }

    // Check if scan exists
    var scan = await scanService.GetScanByIdAsync(id);
    if (scan == null)
    {
        return Results.NotFound(new { 
            message = $"Scan with ID {id} not found",
            statusCode = 404 
        });
    }

    // Add the note
    var note = await scanService.AddNoteToScanAsync(id, createNoteDto.Title, createNoteDto.Content);
    
    var noteDto = new NoteDto
    {
        Id = note.Id,
        Title = note.Title,
        Content = note.Content,
        CreatedAt = note.CreatedAt,
        ScanId = note.ScanId
    };
    
    return Results.Created($"/api/scans/{id}/notes/{note.Id}", noteDto);
})
.WithName("AddNoteToScan");

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }))
.WithName("HealthCheck");

app.Run(); 