using ScanNotesManager.Backend.Models;

namespace ScanNotesManager.Backend.Services;

public class ScanService : IScanService
{
    private readonly List<Scan> _scans;
    private readonly List<Note> _notes;
    private int _nextScanId = 1;
    private int _nextNoteId = 1;

    public ScanService()
    {
        _scans = new List<Scan>();
        _notes = new List<Note>();
        SeedData();
    }

    public Task<List<Scan>> GetAllScansAsync()
    {
        return Task.FromResult(_scans);
    }

    public Task<Scan?> GetScanByIdAsync(int id)
    {
        var scan = _scans.FirstOrDefault(s => s.Id == id);
        return Task.FromResult(scan);
    }

    public Task<List<Note>> GetNotesByScanIdAsync(int scanId)
    {
        var notes = _notes.Where(n => n.ScanId == scanId).ToList();
        return Task.FromResult(notes);
    }

    public Task<Note> AddNoteToScanAsync(int scanId, string title, string content)
    {
        var note = new Note
        {
            Id = _nextNoteId++,
            Title = title,
            Content = content,
            ScanId = scanId,
            CreatedAt = DateTime.UtcNow
        };

        _notes.Add(note);
        return Task.FromResult(note);
    }

    private void SeedData()
    {
        // Create sample scans
        var scans = new List<Scan>
        {
            new Scan
            {
                Id = _nextScanId++,
                PatientName = "John Doe",
                ScanDate = DateTime.UtcNow.AddDays(-2),
                ScanType = "CT Chest"
            },
            new Scan
            {
                Id = _nextScanId++,
                PatientName = "Jane Smith",
                ScanDate = DateTime.UtcNow.AddDays(-1),
                ScanType = "MRI Brain"
            },
            new Scan
            {
                Id = _nextScanId++,
                PatientName = "Bob Johnson",
                ScanDate = DateTime.UtcNow.AddHours(-3),
                ScanType = "X-Ray Abdomen"
            }
        };

        _scans.AddRange(scans);

        // Create sample notes
        var notes = new List<Note>
        {
            new Note
            {
                Id = _nextNoteId++,
                Title = "Initial Review",
                Content = "No abnormalities detected in the chest CT scan.",
                ScanId = 1,
                CreatedAt = DateTime.UtcNow.AddMinutes(-30)
            },
            new Note
            {
                Id = _nextNoteId++,
                Title = "Follow-up Required",
                Content = "Recommend follow-up scan in 6 months.",
                ScanId = 1,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15)
            },
            new Note
            {
                Id = _nextNoteId++,
                Title = "Radiologist Review",
                Content = "Brain MRI shows normal structures.",
                ScanId = 2,
                CreatedAt = DateTime.UtcNow.AddMinutes(-45)
            }
        };

        _notes.AddRange(notes);
    }
} 