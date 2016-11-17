import {protocol} from '../protocol';
export const Counted = protocol({count: null});
export const count = Counted.count;
export default Counted;