import {flip} from '../core';
import {protocol} from '../protocol';
export const Indexed = protocol({nth: null});
export const nth = flip(Indexed.nth, 2);
export default Indexed;