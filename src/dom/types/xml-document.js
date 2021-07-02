export * from "./xml-document/construct.js";
import {XMLDocument} from "dom";
import behave from "./html-document/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {XMLDocument: behave});
behave(XMLDocument);
