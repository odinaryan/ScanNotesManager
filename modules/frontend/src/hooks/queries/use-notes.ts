import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scanApi } from '../../services/api';
import { queryKeys } from '../../lib/query-client';
import type { CreateNoteRequest, Note } from '../../types';

// Hook to fetch notes for a specific scan
export const useNotes = (scanId: number | null) => {
  return useQuery({
    queryKey: queryKeys.notesByScan(scanId!),
    queryFn: () => scanApi.getNotesByScanId(scanId!),
    enabled: !!scanId, // Only run query if scanId exists
    staleTime: 2 * 60 * 1000, // 2 minutes (notes change more frequently)
    refetchOnWindowFocus: true,
  });
};

// Type for the mutation context
interface MutationContext {
  previousNotes?: Note[];
}

// Hook to add a new note with optimistic updates
export const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, { scanId: number; note: CreateNoteRequest }, MutationContext>({
    mutationFn: ({ scanId, note }) =>
      scanApi.addNoteToScan(scanId, note),
    
    // Optimistic update
    onMutate: async ({ scanId, note }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.notesByScan(scanId) });

      // Snapshot the previous value
      const previousNotes = queryClient.getQueryData<Note[]>(queryKeys.notesByScan(scanId));

      // Optimistically update to the new value
      const optimisticNote: Note = {
        id: Date.now(), // Temporary ID
        title: note.title,
        content: note.content,
        createdAt: new Date().toISOString(),
        scanId: scanId,
      };

      queryClient.setQueryData<Note[]>(queryKeys.notesByScan(scanId), (old) => 
        old ? [...old, optimisticNote] : [optimisticNote]
      );

      // Return a context object with the snapshotted value
      return { previousNotes };
    },

    // If the mutation succeeds, we don't need to do anything as the optimistic update is correct
    onSuccess: (newNote, { scanId }) => {
      // Update the cache with the real note from the server
      queryClient.setQueryData<Note[]>(queryKeys.notesByScan(scanId), (old) => {
        if (!old) return [newNote];
        // Replace the optimistic note with the real one
        return old.map((note) => 
          note.id === Date.now() || note.title === newNote.title ? newNote : note
        );
      });
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, { scanId }, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData<Note[]>(queryKeys.notesByScan(scanId), context.previousNotes);
      }
    },

    // Always refetch after error or success
    onSettled: (data, error, { scanId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notesByScan(scanId) });
    },
  });
}; 