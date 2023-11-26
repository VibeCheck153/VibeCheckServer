import { Date } from "mongoose";

type Location = {
    latitude: number;
    longitude: number;
};

export interface IUser{
    _id: string;
    username: string;
    dob: Date;
    email: string;
    photoURL: string;
    password: string;
    location: Location;
}

/**
 * User parameters
 * 1. ID
 * 2. PhotoURL
 * 3. Username
 * 4. Password
 * 5. Date of Birth
 * 6. Location
 * 7. Email
 */

