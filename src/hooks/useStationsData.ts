import { useEffect } from 'react';
import { Person } from '@/types';
import stationsData from '@/data/stations.json';

interface StationData {
  id: string;
  name: string;
}

export function useStationsData(
  persons: Person[],
  setPersons: (persons: Person[]) => void
) {
  useEffect(() => {
    // Only initialize stations if no persons exist yet
    if (persons.length === 0) {
      const initialPersons: Person[] = (stationsData as StationData[]).map((station) => ({
        id: `station-${station.id}`,
        name: station.name,
        tasks: []
      }));
      
      setPersons(initialPersons);
    }
  }, [persons.length, setPersons]);
}