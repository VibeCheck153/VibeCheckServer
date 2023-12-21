type Location = {
    latitude: number;
    longitude: number;
};

export interface IVenue{
    id: string;
    type: string;
    name: string;
    desc: string;
    gmap_link: string;
    instagram_link: string;
    location: string;
    coordinates: Location;
    address: string;
}

export class VenueFactory {
    static createVenueFromRecord(record: any, secretKey: string): IVenue {
      return {
        id: record.get('id'),
        type: record.get('type'),
        name: record.get('name'),
        desc: record.get('desc'),
        gmap_link: record.get('googleMaps'),
        instagram_link: record.get('instagramLink'),
        address: record.get('address'),
        location: record.get('location'),
        coordinates: {latitude: record.get('coordinates')[0], longitude:record.get('coordinates')[2]},
      };
    }
  }


/**
 * Venue parameters
 * 1. ID
 * 2. Name
 * 3. Location
 * 4. GoogleMapsLink
 * 5. InstagramLink
 */

