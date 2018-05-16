import {protocol} from "../protocol";
function _deref(self){
  return self == null ? null : self.valueOf();
}
export const IDeref = protocol({
  deref: _deref
});
export const deref = IDeref.deref;
export default IDeref;