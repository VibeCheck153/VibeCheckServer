import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";

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

//Phone, social handle, google, apple

const User = new mongoose.Schema(
    {
        _id: {
            type: Schema.Types.UUID,
            require: true,
            unique: true,
            index: true
        },
        username:{
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            validate: (value: string) => value.length > 3 && value.length < 16,
        },
        photoURL:{
            type: String,
            require: false,
            default: "null"
        },
        email:{
            type: String,
            require: true,
            unique: true,
            validate: (value: string) => value.endsWith("@gmail.com")
        },
        //! Come up with the extension
        password:{},
        dob: {
            type: Date,
            require: true,
        },
        //! PointSchema, 2dIndex
        location:{
            type: Map,
            require: false,
            default: new Map([
                ["latitude", 90],
                ["longitude", 180]
            ]
            )
        }
    }
);


export default mongoose.model<IUser & mongoose.Document>("User", User);