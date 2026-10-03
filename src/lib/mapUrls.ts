import type { Opportunity } from '@/types/student';

export const getDirectionsUrl = ({ id, location, coordinates }: Pick<Opportunity, 'id' | 'location' | 'coordinates'>) => {
  // Only local demo opportunities provide exact destinations; other listings use their stated location.
  const destination = id.startsWith('opp-') && coordinates ? `${coordinates.lat},${coordinates.lng}` : location;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
};
