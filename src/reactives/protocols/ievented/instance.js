import * as _ from "atomic/core";

function on2(self, f){
  f(self);
}

function on3(self, pred, f){
  if (pred(self)) {
    f(self);
  }
}

const on = _.overload(null, null, on2, on3);

export const IEvented = _.protocol({
  on,
  trigger: null
});
