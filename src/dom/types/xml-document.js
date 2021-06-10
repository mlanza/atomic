export * from "./xml-document/construct.js";
import {XMLDocument} from "dom";
import {behaveAsHTMLDocument} from "./html-document/behave.js";
behaveAsHTMLDocument(XMLDocument);