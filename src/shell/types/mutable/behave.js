import * as _ from "atomic/core";

function deref(self){
  return self.state;
}

export default _.does(
  _.keying("Mutable"),
  _.implement(_.IDeref, {deref}));
