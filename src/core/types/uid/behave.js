import {does} from "../../core.js";
import behave from "../guid/behave.js";
import {keying} from "../../protocols/imapentry/concrete.js";

export default does(
  behave,
  keying("UID"));
