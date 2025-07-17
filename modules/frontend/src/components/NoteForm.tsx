import { useState } from 'react';
import { useAddNote } from '../hooks';
import { useSelectedScanId } from '../stores/app-store';

interface FormErrors {
  title?: string;
  content?: string;
}

const NoteForm = () => {
  const selectedScanId = useSelectedScanId();
  const addNoteMutation = useAddNote();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length > 1000) {
      newErrors.content = 'Content must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm() || !selectedScanId) {
      return;
    }

    try {
      await addNoteMutation.mutateAsync({
        scanId: selectedScanId,
        note: {
          title: title.trim(),
          content: content.trim(),
        },
      });

      // Reset form after successful submission
      setTitle('');
      setContent('');
      setErrors({});
    } catch (error) {
      // Error is handled by TanStack Query and displayed in the ErrorBanner
      console.error('Failed to add note:', error);
    }
  };

  const handleClear = (): void => {
    setTitle('');
    setContent('');
    setErrors({});
  };

  if (!selectedScanId) {
    return null; // Don't render form if no scan is selected
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`form-input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter note title..."
            disabled={addNoteMutation.isPending}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {title.length}/100 characters
          </p>
        </div>

        <div>
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className={`form-textarea ${errors.content ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter note content..."
            disabled={addNoteMutation.isPending}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {content.length}/1000 characters
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary"
            disabled={addNoteMutation.isPending}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={addNoteMutation.isPending || !title.trim() || !content.trim()}
          >
            {addNoteMutation.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add Note'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm; 