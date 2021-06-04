export * from "./xml-document/construct";
import {XMLDocument} from "dom";
import {behaveAsHTMLDocument} from "./html-document/behave";
behaveAsHTMLDocument(XMLDocument);