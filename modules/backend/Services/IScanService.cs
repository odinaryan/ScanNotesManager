using ScanNotesManager.Backend.Models;

namespace ScanNotesManager.Backend.Services;

public interface IScanService
{
    Task<List<Scan>> GetAllScansAsync();
    Task<Scan?> GetScanByIdAsync(int id);
    Task<List<Note>> GetNotesByScanIdAsync(int scanId);
    Task<Note> AddNoteToScanAsync(int scanId, string title, string content);
} 