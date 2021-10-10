import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function on(self, pattern, callback){
  if (_.test(pattern, self)) {
    callback(matched);
  }
}

export default _.does(
  _.naming("Location"),
  _.implement($.IEvented, {on}));
