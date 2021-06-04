export * from "./html-document/construct";
import {HTMLDocument} from "dom";
import {behaveAsHTMLDocument} from "./html-document/behave";
behaveAsHTMLDocument(HTMLDocument);