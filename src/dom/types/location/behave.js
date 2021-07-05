import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function matches(self, pattern){
  if (_.isRegExp(pattern)){
    return _.test(pattern, decodeURI(self.pathname));
  } else if (_.isString(pattern)) {
    return matches(self, new RegExp(pattern, "i"));
  }
}

function on(self, pattern, callback){
  const matched = matches(self, pattern);
  if (matched) {
    callback(matched);
  }
}

export default _.does(
  _.implement($.IEvented, {on}),
  _.implement(_.IMatchable, {matches}));
