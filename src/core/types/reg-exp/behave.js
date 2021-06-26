import {implement} from "../protocol.js";
import {does} from "../../core.js";
import {IMatchable} from "../../protocols.js";

function matches(self, text){
  return self.test(text);
}

export default does(
  implement(IMatchable, {matches}));