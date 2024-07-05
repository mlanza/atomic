import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {ILookup} from "../../protocols/ilookup/instance.js";
import {IFn} from "../../protocols/ifn/instance.js";

function invoke(self, ...args){
  const key = self.dispatch.apply(this, args);
  const f = ILookup.lookup(self.methods, key) || self.fallback;
  if (!f) {
    throw new Error("Unable to locate appropriate method.");
  }
  return f.apply(this, args);
}

export default does(
  keying("Multimethod"),
  implement(IFn, {invoke}));
