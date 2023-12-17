type Location = {
    latitude: number;
    longitude: number;
};

export interface IVenue{
    _id: string;
    name: string;
    desc: string;
    googleMaps: string;
    instagramLink: string;
    location: Location;
    locationString: string;
}

/**
 * Venue parameters
 * 1. ID
 * 2. Name
 * 3. Location
 * 4. GoogleMapsLink
 * 5. InstagramLink
 */

