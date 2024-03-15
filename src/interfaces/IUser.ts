import { encrypt } from '../services/encryption';

export interface IUser {
  uid: string;
  username: string;
  age: number;
  email: string;
  photoURL: string;
  latitude: number;
  longitude: number;
  likes: number;
  vibePoints: number;
  phoneNumber: string;
  gender: string;
  level: number;
  genres: Array<string>;
}

export class UserFactory {
  static createUserFromRecord(record: any, secretKey: string): IUser {
    return {
      uid: encrypt(record.get('uid'))['encryptedData'],
      username: record.get('username'),
      age: record.get('age').toNumber(),
      email: record.get('email'),
      photoURL: record.get('photoURL'),
      phoneNumber: record.get('phoneNumber'),
      gender: record.get('gender'),
      latitude: record.get('latitude'),
      longitude: record.get('longitude'),
      likes: record.get('likes'),
      vibePoints: record.get('vibePoints'),
      level: record.get('level'),
      genres: record.get('genres'),
    };
  }
}

/**
 * User parameters
 * 1. ID
 * 2. PhotoURL
 * 3. Username
 * 4. VibePoints
 * 5. Date of Birth
 * 6. Location
 * 7. Email
 */
