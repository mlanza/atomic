import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {some} from "../lazy-seq/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {equiv} from "../../protocols/iequiv/concrete.js";
import {hash} from "../../protocols/ihashable/concrete.js";
import {IFn} from "../../protocols/ifn/instance.js";

function invoke(self, ...args){
  const key = self.dispatch.apply(this, args);
  const hashcode = hash(key);
  const potentials = self.methods[hashcode];
  const f = some(function([k, h]){
    return equiv(k, key) ? h : null;
  }, potentials) || self.fallback || function(){
    throw new Error("Unable to locate appropriate method.");
  };
  return f.apply(this, args);
}

export default does(
  keying("Multimethod"),
  implement(IFn, {invoke}));
