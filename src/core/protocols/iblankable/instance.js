import {protocol} from "../../types/protocol";
import {identity, constantly} from "../../core";
const blank = constantly(false);
export const IBlankable = protocol({blank});