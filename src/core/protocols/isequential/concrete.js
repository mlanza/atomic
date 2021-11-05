import {satisfies} from "../../types/protocol.js";
import {ISequential} from "./instance.js";
import {cons} from "../../types/list/construct.js";

export function sequential(items){
  return satisfies(ISequential, items) ? items : cons(items);
}
