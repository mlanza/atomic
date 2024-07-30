import * as _ from "atomic/core";
import * as $ from "../../effects.js";
import {IOmissible} from "./instance.js";
export const omit = _.overload(null, IOmissible.omit, $.doing(IOmissible.omit));
