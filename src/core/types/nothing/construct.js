import {constantly} from "../../core.js";
import Symbol from "symbol";

export function Nothing(){
}

Nothing.prototype[Symbol.toStringTag] = "Nothing";

export const nothing = new Nothing();
