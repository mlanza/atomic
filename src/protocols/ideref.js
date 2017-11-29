import {protocol} from "../protocol";

export const IDeref = protocol({
  deref: null
});

export const deref = IDeref.deref;
export default IDeref;