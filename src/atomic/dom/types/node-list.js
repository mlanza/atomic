export * from "./node-list/construct.js";
import behave from "./node-list/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {NodeList: behave});
behave(NodeList);
