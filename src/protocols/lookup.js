import {protocol} from '../protocol';
export const Lookup = protocol({get: null});
export const get = Lookup.get;
export default Lookup;