// API Response Types
export interface Scan {
  id: number;
  patientName: string;
  scanDate: string;
  scanType: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  scanId: number;
}

// Request Types
export interface CreateNoteRequest {
  title: string;
  content: string;
}

// Component Props Types
export interface ScanListProps {
  scans: Scan[];
  selectedScanId: number | null;
  onScanSelect: (scanId: number) => void;
}

export interface ScanDetailProps {
  scan: Scan | null;
  notes: Note[];
  onNoteAdd: (note: CreateNoteRequest) => void;
  isLoading: boolean;
}

export interface NoteFormProps {
  onSubmit: (note: CreateNoteRequest) => void;
  isLoading: boolean;
}

export interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
}

// API Error Types
export interface ApiError {
  message: string;
  status: number;
} 