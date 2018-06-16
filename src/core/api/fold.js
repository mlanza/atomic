import {overload, partial, identity, constantly} from "../core";
import {IFold} from "../protocols/ifold";

function fold2(error, okay){
  return function(self){
    return IFold.fold(self, error, okay);
  }
}

export const fold = overload(null, null, fold2, IFold.fold);