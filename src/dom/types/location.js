export * from "./location/construct.js";
import {Location} from "dom";
import behave from "./location/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Location: behave});
behave(Location);
