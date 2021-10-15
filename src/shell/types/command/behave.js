import * as _ from "atomic/core";

function hash(self){
  return _.hash({type: self.type, attrs: self.attrs});
}

function identifier(self){
  return self.type;
}

export default _.does(
  _.record,
  _.naming("Command"),
  _.implement(_.IHashable, {hash}),
  _.implement(_.IIdentifiable, {identifier}));
