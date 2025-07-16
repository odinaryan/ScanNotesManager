import { useState, useEffect } from 'react';
import type { Scan, Note, CreateNoteRequest, ApiError } from './types';
import { scanApi } from './services/api';
import ScanList from './components/ScanList';
import ScanDetail from './components/ScanDetail';

function App() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load scans on component mount
  useEffect(() => {
    const loadScans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedScans = await scanApi.getScans();
        setScans(fetchedScans);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        console.error('Failed to load scans:', apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadScans();
  }, []);

  // Load notes when a scan is selected
  useEffect(() => {
    if (selectedScanId) {
      const loadNotes = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const fetchedNotes = await scanApi.getNotesByScanId(selectedScanId);
          setNotes(fetchedNotes);
        } catch (err) {
          const apiError = err as ApiError;
          setError(apiError.message);
          console.error('Failed to load notes:', apiError);
        } finally {
          setIsLoading(false);
        }
      };

      loadNotes();
    } else {
      setNotes([]);
    }
  }, [selectedScanId]);

  const handleScanSelect = (scanId: number) => {
    setSelectedScanId(scanId);
  };

  const handleNoteAdd = async (noteRequest: CreateNoteRequest) => {
    if (!selectedScanId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const newNote = await scanApi.addNoteToScan(selectedScanId, noteRequest);
      setNotes(prevNotes => [...prevNotes, newNote]);
      
      // Show success message (you could use a toast library here)
      console.log('Note added successfully');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      console.error('Failed to add note:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedScan = scans.find(scan => scan.id === selectedScanId) || null;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-secondary-900">
            Scan Notes Manager
          </h1>
          <p className="text-sm text-secondary-600 mt-1">
            Manage and review patient scan notes
          </p>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-secondary-200 flex-shrink-0">
          <ScanList
            scans={scans}
            selectedScanId={selectedScanId}
            onScanSelect={handleScanSelect}
          />
        </div>

        {/* Main Panel */}
        <div className="flex-1 overflow-hidden">
          <ScanDetail
            scan={selectedScan}
            notes={notes}
            onNoteAdd={handleNoteAdd}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
