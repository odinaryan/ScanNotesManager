import { useScans } from '../hooks';
import { useAppStore } from '../stores/app-store';

const ScanList = () => {
  const { data: scans, isLoading, error } = useScans();
  const { selectedScanId, selectScan } = useAppStore();

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

  const handleScanSelect = (scanId: number): void => {
    selectScan(scanId);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Patient Scans</h2>
        <p className="text-sm text-gray-600 mt-1">
          {scans?.length || 0} scan{(scans?.length || 0) !== 1 ? 's' : ''} available
        </p>
      </div>
      
      <div className="p-2">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading scans...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading scans</p>
            <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        ) : !scans || scans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No scans available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => handleScanSelect(scan.id)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-200 border
                  ${selectedScanId === scan.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {scan.patientName}
                    </h3>
                    <p className="text-sm text-blue-600 mt-1">
                      {scan.scanType}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <span>{formatDate(scan.scanDate)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(scan.scanDate)}</span>
                    </div>
                  </div>
                  
                  {selectedScanId === scan.id && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanList; 