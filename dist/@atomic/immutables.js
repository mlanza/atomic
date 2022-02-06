import _ from "./core.js";
import * as imm from "../atomic/immutables.js";
export default _.impart(Object.assign({}, imm), _.partly);
