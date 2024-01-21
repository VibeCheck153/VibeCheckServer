import mongoose, { Schema } from 'mongoose';
import { IVenue } from '../interfaces/IVenue';

/**
 * Venue parameters
 * 1. ID
 * 2. Name
 * 3. Location
 * 4. GoogleMapsLink
 * 5. InstagramLink
 */

//Phone, social handle, google, apple

const Venue = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  googleMapsLink: {
    type: String,
    require: true,
  },
  instagramLink: {
    type: String,
    require: false,
    default: null,
  },
  //! PointSchema, 2dIndex
  location: {
    type: Map,
    require: false,
    default: new Map([
      ['latitude', 90],
      ['longitude', 180],
    ]),
  },
  locationString: {
    type: String,
    require: false,
    default: null,
  },
});

export default mongoose.model<IVenue & mongoose.Document>('Venue', Venue);
