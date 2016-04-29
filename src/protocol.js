import {subj} from "./core/function.js";
import * as protocol from "./core/protocol.js";
export {create} from "./core/protocol.js";
export const def       = subj(protocol.def);
export const satisfies = subj(protocol.satisfies);
export const extend    = subj(protocol.extend);
export default protocol.create;
