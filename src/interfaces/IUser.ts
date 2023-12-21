import { encrypt } from "../services/encryption";

type Location = {
    latitude: number;
    longitude: number;
};

export interface IUser{
    uid: string;
    username: string;
    dob: Date;
    age: number;
    email: string;
    photoURL: string;
    location: Location;
    likes: number;
    vibePoints: number;
    //!Not sure
    level: number;
}

export class UserFactory {
    static createUserFromRecord(record: any, secretKey: string): IUser {
      return {
        uid: encrypt(record.get('uid'))["encryptedData"],
        username: record.get('username'),
        dob: (new Date(record.get('dob'))),
        age: record.get('age').toNumber(),
        email: record.get('email'),
        photoURL: record.get('photoURL'),
        location: {latitude: record.get('location')[0], longitude:record.get('location')[2]},
        likes: record.get('likes'),
        vibePoints: record.get('vibePoints'),
        level: record.get('level'),
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

