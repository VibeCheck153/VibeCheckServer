import { S3 } from "aws-sdk";
import config from "../config";
import {v4 as uuidv4} from 'uuid';


const s3Uploadv2 = async (file) => {
    const s3 = new S3();

    const param = {
        Bucket: config.awsBucketName,
        Key: `uploads/${uuidv4() + '-' + file.originalname}`,
        Body: file.buffer
    };

    const result = await s3.upload(param).promise();

    console.log(result);

    return result;
}

export default s3Uploadv2;