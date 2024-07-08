import {does} from "../../core.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import behave from "../set/behave.js";

export default does(
  behave,
  keying("WeakSet"));
