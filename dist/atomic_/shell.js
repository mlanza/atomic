import _ from "./core.js";
import * as sh from "../atomic/shell.js";
const $ = _.overload(null, sh.atom, sh.map);
export default _.impart($, sh, _.partly);
