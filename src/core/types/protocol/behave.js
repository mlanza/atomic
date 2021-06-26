import {IMap} from "../../protocols/imap/instance.js";
import {implement} from "./concrete.js";
import {does} from "../../core.js";

function keys(self){
  return self.keys();
}

export default does(
  implement(IMap, {keys}));