import behave from "../command/behave.js";
import * as _ from "atomic/core";
export * from "../command/behave.js";
export default _.does(behave, _.keying("Event"));
