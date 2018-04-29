import {protocol} from '../protocol';
export const IKVReduce = protocol({
  _reducekv: null
});
export function reducekv(xf, init, coll){
  return IKVReduce._reducekv(coll, xf, init);
}
export default IKVReduce;