import { useNotes } from '../hooks';
import { useSelectedScanId } from '../stores/app-store';

const NoteList = () => {
  const selectedScanId = useSelectedScanId();
  const { data: notes, isLoading, error } = useNotes(selectedScanId);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const noteDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - noteDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center py-8 text-red-500">
          <p>Error loading notes</p>
          <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <span className="text-sm text-gray-500">
          {notes?.length || 0} note{(notes?.length || 0) !== 1 ? 's' : ''}
        </span>
      </div>

      {!notes || notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm">No notes available for this scan</p>
          <p className="text-xs text-gray-400 mt-1">Add a note using the form above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((note) => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">{note.title}</h4>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {getTimeAgo(note.createdAt)}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {note.content}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 border-t border-gray-100 pt-2">
                  <span>Created on {formatDate(note.createdAt)}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTime(note.createdAt)}</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default NoteList; 