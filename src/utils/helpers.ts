const Hashids = require('hashids/cjs');
import { Service, Inject } from 'typedi';

@Service()
export default class HelperService {

  private hashids: any;
  private hashIdsObj: any;

  constructor(@Inject('logger') private logger) {
    this.hashids = {
      salt: 'this is my salt',
      minHashLength: 10,
      alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    };

    this.hashIdsObj = new Hashids(this.hashids.salt, this.hashids.minHashLength, this.hashids.alphabet);
  }

  public static validatePayload(reqBody: any): void {
    for (const key in reqBody) {
      if (Object.prototype.hasOwnProperty.call(reqBody, key)) {
        const element = reqBody[key];
        if (element == undefined) {
          console.debug("Null values found with:", key, element);
          throw new Error(`Null values found with:${key}, ${element}`);
        }
      }
    }
  }

  isNumber = function isNumber(a) {
    const value = Number(a);
    return typeof value === 'number' && isFinite(value);
  };

  public getTokenFromHeader(req: any) {
    if (
      (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }


  public decodeHash(guId: any): any {
    if (guId != undefined && guId != "") {
      if (isNaN(guId)) {
        return guId ? this.hashIdsObj.decode(guId)[0] : '';
      } else {
        return guId;
      }
    } else {
      return guId;
    }
  }

  public encodeHash(guId: any): any {
    if (guId != undefined && guId != "") {
      return this.isNumber(guId) ? this.hashIdsObj.encode(guId) : guId;
    } else {
      return "";
    }
  }

}
