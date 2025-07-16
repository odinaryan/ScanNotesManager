namespace ScanNotesManager.Backend.Models;

public class Scan
{
    public int Id { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime ScanDate { get; set; }
    public string ScanType { get; set; } = string.Empty;
    public List<Note> Notes { get; set; } = new();
} 