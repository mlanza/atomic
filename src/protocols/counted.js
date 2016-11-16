import {protocol} from '../protocol.js';
export const Counted = protocol({count: null});
export const count = Counted.count;
export default Counted;