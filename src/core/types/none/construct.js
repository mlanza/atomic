import {constantly} from "../../core.js";
import Symbol from "symbol";

export function None(){
}

None.prototype[Symbol.toStringTag] = "None";

export const none = new None();
