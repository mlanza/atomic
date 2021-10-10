import {does} from "../../core.js";
import behave from "../guid/behave.js";
import {naming} from "../../protocols/inamable/concrete.js";

export default does(
  behave,
  naming("UID"));
