import * as _ from "atomic/core";
import * as imm from "atomic/immutables";

function hash(self){
  return imm.hash({type: self.type, attrs: self.attrs});
}

function identifier(self){
  return self.type;
}

export default _.does(
  _.record,
  _.implement(imm.IHash, {hash}),
  _.implement(_.IIdentifiable, {identifier}));
