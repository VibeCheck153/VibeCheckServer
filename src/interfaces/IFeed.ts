import { Date } from 'neo4j-driver';

type Location = {
  latitude: number;
  longitude: number;
};

export interface IFeed {
  id: string;
  dateTime: Date;
  music: string;
  genre: string;
  likes: number;
  address: string;
  latitude: number;
  longitude: number;
}

export class FeedFactory {
  static createFeedFromRecord(record: any, secretKey: string): IFeed {
    return {
      id: record.get('id'),
      music: record.get('music'),
      dateTime: record.get('dateTime'),
      likes: record.get('likes') ?? 0,
      genre: record.get('genre'),
      address: record.get('address'),
      latitude: record.get('latitude'),
      longitude: record.get('longitude'),
    };
  }
}
