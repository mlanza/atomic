import {constantly} from "../../core.js";

export function Nothing(){
}

Nothing.prototype[Symbol.toStringTag] = "Nothing";

export const nothing = new Nothing();
