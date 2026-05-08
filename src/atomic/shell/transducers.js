import * as _ from "atomic/core";

export function hist(limit){ //transducer
  return function(rf){
    let history = [];
    return _.overload(rf, rf, function(memo, value){
      const revised = _.clone(history);
      revised.unshift(value);
      if (revised.length > limit) {
        revised.pop();
      }
      history = revised;
      return rf(memo, history);
    });
  }
}
