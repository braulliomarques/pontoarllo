import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

export function useRealTimeData(
  path: string,
  filter?: (data: any) => boolean,
  queryConstraints?: {
    orderBy?: string;
    equalTo?: string;
  }
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let dbRef = ref(db, path);
    
    if (queryConstraints) {
      dbRef = query(
        dbRef,
        orderByChild(queryConstraints.orderBy || ''),
        equalTo(queryConstraints.equalTo || '')
      );
    }
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        const val = snapshot.val();
        if (val) {
          const transformedData = Object.values(val);
          setData(filter ? transformedData.filter(filter) : transformedData);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path, filter, queryConstraints?.orderBy, queryConstraints?.equalTo]);

  return { data, loading, error };
}