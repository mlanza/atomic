import {protocol} from '../protocol.js';
export const Emptyable = protocol({empty: null});
export const empty = Emptyable.empty;
export default Emptyable;