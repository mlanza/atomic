import {protocol} from '../protocol';
export const Collection = protocol({conj: null, has: null});
export const conj = Collection.conj;
export const has = Collection.has;
export default Collection;