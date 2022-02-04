export * from "./html-document/construct.js";
import behave from "./html-document/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {HTMLDocument: behave});
behave(HTMLDocument);
