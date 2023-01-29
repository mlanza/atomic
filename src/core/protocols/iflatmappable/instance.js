import {protocol} from "../../types/protocol.js";
import {chain} from "../../core.js";
import {IFunctor} from "../ifunctor/instance.js";

function flatMap(self, f){
  return chain(self, IFlatMappable.flat, IFunctor.fmap(?, f));
}

export const IFlatMappable = protocol({
  flat: null,
  flatMap
});
