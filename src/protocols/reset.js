import {protocol} from '../protocol';
export const Reset = protocol({reset: null});
export const reset = Reset.reset;
export default Reset;