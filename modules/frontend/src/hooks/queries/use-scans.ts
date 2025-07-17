import { useQuery } from '@tanstack/react-query';
import { scanApi } from '../../services/api';
import { queryKeys } from '../../lib/query-client';
import type { Scan } from '../../types';

// Hook to fetch all scans
export const useScans = () => {
  return useQuery<Scan[], Error>({
    queryKey: queryKeys.scans,
    queryFn: scanApi.getScans,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

// Hook to get a specific scan by ID (derived from the scans query)
export const useScan = (scanId: number | null): Scan | null => {
  const { data: scans } = useScans();
  
  if (!scanId || !scans) {
    return null;
  }
  
  return scans.find((scan: Scan) => scan.id === scanId) || null;
}; 