import { ref, set, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import * as turf from '@turf/turf';

type Location = {
  latitude: number;
  longitude: number;
};

type GeofenceArea = {
  center: [number, number];
  radius: number;
};

export class TimeRecordService {
  static async recordTime(
    employeeId: string,
    location: Location,
    allowedArea: GeofenceArea
  ) {
    // Check if employee is within allowed area
    const point = turf.point([location.longitude, location.latitude]);
    const center = turf.point([allowedArea.center[1], allowedArea.center[0]]);
    const distance = turf.distance(point, center, { units: 'meters' });

    if (distance > allowedArea.radius) {
      throw new Error('Localização fora da área permitida');
    }

    const recordId = uuidv4();
    const timestamp = serverTimestamp();

    await set(ref(db, `timeRecords/${recordId}`), {
      id: recordId,
      employeeId,
      timestamp,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      type: 'punch',
      status: 'valid'
    });

    return recordId;
  }

  static async getLastRecord(employeeId: string) {
    // Implementation for getting last record
  }

  static async getDailyRecords(employeeId: string, date: Date) {
    // Implementation for getting daily records
  }
}