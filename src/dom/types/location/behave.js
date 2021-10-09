import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import Symbol from "symbol";

function on(self, pattern, callback){
  if (_.test(pattern, self)) {
    callback(matched);
  }
}

export default _.does(
  _.naming(?, Symbol("Location")),
  _.implement($.IEvented, {on}));
