namespace ScanNotesManager.Backend.DTOs;

public class ScanDto
{
    public int Id { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime ScanDate { get; set; }
    public string ScanType { get; set; } = string.Empty;
} 