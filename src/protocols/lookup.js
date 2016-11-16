import {flip} from '../core.js';
import {protocol} from '../protocol.js';
export const Lookup = protocol({lookup: null});
export const lookup = flip(Lookup.lookup, 2);
export default Lookup;