using ScanNotesManager.Backend.Services;
using ScanNotesManager.Backend.DTOs;
using ScanNotesManager.Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure URLs to use port 8080
builder.WebHost.UseUrls("http://+:8080");

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

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
.WithName("GetScans")
.WithOpenApi();

// GET /api/scans/{id}/notes - Get notes for a specific scan
app.MapGet("/api/scans/{id}/notes", async (int id, IScanService scanService) =>
{
    var scan = await scanService.GetScanByIdAsync(id);
    if (scan == null)
    {
        return Results.NotFound($"Scan with ID {id} not found");
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
.WithName("GetNotesByScan")
.WithOpenApi();

// POST /api/scans/{id}/notes - Add a note to a scan
app.MapPost("/api/scans/{id}/notes", async (int id, CreateNoteDto createNoteDto, IScanService scanService) =>
{
    // Check if scan exists
    var scan = await scanService.GetScanByIdAsync(id);
    if (scan == null)
    {
        return Results.NotFound($"Scan with ID {id} not found");
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
.WithName("AddNoteToScan")
.WithOpenApi();

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }))
.WithName("HealthCheck")
.WithOpenApi();

app.Run(); 