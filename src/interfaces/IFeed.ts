import { Date } from 'neo4j-driver';

type Location = {
  latitude: number;
  longitude: number;
};

export interface IFeed {
  id: string;
  dateTime: Date;
  music: string;
  likes: number;
  location: string;
  coordinates: Location;
}

export class FeedFactory {
  static createFeedFromRecord(record: any, secretKey: string): IFeed {
    return {
      id: record.get('id'),
      music: record.get('music'),
      dateTime: record.get('dateTime'),
      likes: record.get('likes') ?? 0,
      location: record.get('location'),
      coordinates: { latitude: record.get('coordinates')[0], longitude: record.get('coordinates')[1] },
    };
  }
}
