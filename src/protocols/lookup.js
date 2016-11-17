import {flip} from '../core';
import {protocol} from '../protocol';
export const Lookup = protocol({get: null});
export const get = flip(Lookup.get, 2);
export default Lookup;