import {protocol} from '../protocol';
export const ICounted = protocol({count: null});
export const count = ICounted.count;
export default ICounted;