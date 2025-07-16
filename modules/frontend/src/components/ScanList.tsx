import type { ScanListProps } from '../types';

const ScanList = ({ scans, selectedScanId, onScanSelect }: ScanListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900">Patient Scans</h2>
        <p className="text-sm text-secondary-600 mt-1">
          {scans.length} scan{scans.length !== 1 ? 's' : ''} available
        </p>
      </div>
      
      <div className="p-2">
        {scans.length === 0 ? (
          <div className="text-center py-8 text-secondary-500">
            <p>No scans available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => onScanSelect(scan.id)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-200 border
                  ${selectedScanId === scan.id
                    ? 'bg-primary-50 border-primary-200 shadow-sm'
                    : 'bg-white border-secondary-200 hover:border-primary-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-secondary-900 truncate">
                      {scan.patientName}
                    </h3>
                    <p className="text-sm text-primary-600 mt-1">
                      {scan.scanType}
                    </p>
                    <div className="flex items-center text-xs text-secondary-500 mt-2">
                      <span>{formatDate(scan.scanDate)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(scan.scanDate)}</span>
                    </div>
                  </div>
                  
                  {selectedScanId === scan.id && (
                    <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full"></div>
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