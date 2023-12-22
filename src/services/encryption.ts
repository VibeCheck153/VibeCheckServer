import crypto from 'crypto';
import config from '../config';
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

export function encrypt(text: string) {
 let cipher = crypto.createCipheriv(algorithm, Buffer.from(config.secretKey), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.secretKey), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted;
}
