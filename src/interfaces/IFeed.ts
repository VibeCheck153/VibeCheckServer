type Location = {
    latitude: number;
    longitude: number;
};

export interface IFeed{
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

export class FeedFactory {
    static createVenueFromRecord(record: any, secretKey: string): IFeed {
      return {
        id: record.get('id'),
        type: record.get('type'),
        name: record.get('name'),
        desc: record.get('desc') ?? null,
        gmap_link: record.get('gmap_link'),
        instagram_link: record.get('instagram_link'),
        address: record.get('address'),
        location: record.get('location'),
        coordinates: {latitude: record.get('coordinates')[0], longitude:record.get('coordinates')[1]},
      };
    }
}


