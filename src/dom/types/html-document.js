export * from "./html-document/construct.js";
import {HTMLDocument} from "dom";
import {behaveAsHTMLDocument} from "./html-document/behave.js";
behaveAsHTMLDocument(HTMLDocument);