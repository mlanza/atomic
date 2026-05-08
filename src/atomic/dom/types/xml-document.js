export * from "./xml-document/construct.js";
import behave from "./html-document/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {XMLDocument: behave});
behave(XMLDocument);
