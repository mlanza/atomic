import {ICollection} from "./instance.js";
import {overload, identity} from "../../core.js";
import {reducing} from "../ireducible/concrete.js";
export const conj = overload(function(){
  return [];
}, identity, ICollection.conj, reducing(ICollection.conj));
export const unconj = overload(null, identity, ICollection.unconj, reducing(ICollection.unconj));
