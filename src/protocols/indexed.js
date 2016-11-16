import {flip} from '../core.js';
import {protocol} from '../protocol.js';
export const Indexed = protocol({nth: null});
export const nth = flip(Indexed.nth, 2);
export default Indexed;