import {series} from '../series/construct';

export const Elements = series();

export function elements(coll){
  return new Elements(coll);
}
