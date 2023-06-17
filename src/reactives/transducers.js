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

//regulates message processing so, if there are side effects, each is processed before the next begins
export function isolate(){ //transducer
  return function(rf){
    let queue = [];
    return _.overload(rf, rf, function(memo, value){
      let acc = memo;
      const ready = queue.length === 0;
      queue.push(value);
      if (ready){
        while (queue.length) {
          try {
            acc = rf(acc, queue[0]);
          } finally {
            queue.shift();
          }
        }
      }
      return acc;
    });
  }
}
