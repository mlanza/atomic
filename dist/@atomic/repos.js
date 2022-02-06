import _ from "./core.js";
import * as repos from "../atomic/repos.js";
export default _.impart(Object.assign({}, repos), _.partly);
