import {specify, IMatch, isRegExp, isString, test, does} from 'cloe/core';
import {IEvented} from "cloe/reactives";

function matches(self, pattern){
  if (isRegExp(pattern)){
    return test(pattern, decodeURI(self.pathname));
  } else if (isString(pattern)) {
    return matches(self, new RegExp(pattern, "i"));
  }
}

function on(self, pattern, callback){
  const matched = matches(self, pattern);
  if (matched) {
    callback(matched);
  }
}

export default does(
  specify(IEvented, {on}),
  specify(IMatch, {matches}));