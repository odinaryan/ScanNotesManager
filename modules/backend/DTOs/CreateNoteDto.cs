using System.ComponentModel.DataAnnotations;

namespace ScanNotesManager.Backend.DTOs;

public class CreateNoteDto
{
    [Required(ErrorMessage = "Title is required")]
    [StringLength(100, ErrorMessage = "Title must be less than 100 characters")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Content is required")]
    [StringLength(1000, ErrorMessage = "Content must be less than 1000 characters")]
    public string Content { get; set; } = string.Empty;
} 