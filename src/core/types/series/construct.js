import {doto} from "../../core.js";
import iseries from "./behave.js";

export function series(){
  return doto(function Series(items){
    this.items = items;
  }, iseries);
}
