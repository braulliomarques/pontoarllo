import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://controledeponto-fea96-default-rtdb.firebaseio.com'
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);