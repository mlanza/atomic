import {specify, IMatch, isRegExp, isString, test, does, when} from 'cloe/core';
import {IEvented} from "cloe/reactives";

function matches(self, pattern){
  if (isRegExp(pattern)){
    return test(pattern, decodeURI(self.pathname));
  } else if (isString(pattern)) {
    return matches(self, new RegExp(pattern, "i"));
  }
}

function on(self, pattern, callback){
  when(matches(self, pattern), callback);
}

export default does(
  specify(IEvented, {on}),
  specify(IMatch, {matches}));