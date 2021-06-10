import {protocol} from "../../types/protocol.js";
import {identity, constantly} from "../../core.js";
const blank = constantly(false);
export const IBlankable = protocol({blank});