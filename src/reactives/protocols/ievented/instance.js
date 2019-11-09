import {protocol, overload, identity} from "atomic/core";

function on2(self, f){
  on3(self, identity, f);
}

function on3(self, pred, f){
  if (pred(self)) {
    f(self);
  }
}

const on = overload(null, null, on2, on3);

export const IEvented = protocol({
  on: on,
  off: null,
  trigger: null
});