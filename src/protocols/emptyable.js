import {protocol} from '../protocol';
export const Emptyable = protocol({empty: null});
export const empty = Emptyable.empty;
export default Emptyable;