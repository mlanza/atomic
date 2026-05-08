import {protocol, first} from "atomic/core";

function sel1(self, selector){
  return first(ISelectable.sel(self, selector));
}

export const ISelectable = protocol({
  sel: null,
  sel1: sel1
});
