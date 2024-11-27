import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, MapPin } from 'lucide-react';
import { LocationTracker } from './LocationTracker';
import { TimeRecordService } from './TimeRecordService';
import { useRealTimeData } from '../hooks/useRealTimeData';

type TimeCardProps = {
  employeeId: string;
  allowedArea: {
    center: [number, number];
    radius: number;
  };
};

export function TimeCard({ employeeId, allowedArea }: TimeCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  const { data: todayRecords } = useRealTimeData(
    'timeRecords',
    (record) => record.employeeId === employeeId && 
      new Date(record.timestamp).toDateString() === new Date().toDateString()
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRecord = async () => {
    if (!location) {
      setError('Localização não disponível');
      return;
    }

    setRecording(true);
    setError(null);

    try {
      await TimeRecordService.recordTime(
        employeeId,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        allowedArea
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar ponto');
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {format(currentTime, 'HH:mm:ss')}
        </h2>
        <p className="text-gray-600 mt-1">
          {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>
      
      <div className="mb-6">
        <LocationTracker
          allowedArea={allowedArea}
          onLocationUpdate={setLocation}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={handleRecord}
        disabled={recording || !location}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-400"
      >
        {recording ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Registrando...
          </>
        ) : (
          <>
            <Clock className="h-5 w-5 mr-2" />
            Registrar Ponto
          </>
        )}
      </button>
      
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Registros de Hoje</h3>
        <div className="space-y-2">
          {todayRecords?.map((record: any) => (
            <div key={record.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {format(new Date(record.timestamp), 'HH:mm')}
              </span>
              <span className="font-medium">
                {record.type === 'entry' ? 'Entrada' : 'Saída'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}