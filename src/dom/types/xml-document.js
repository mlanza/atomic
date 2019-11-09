export * from "./xml-document/construct";
import {XMLDocument} from "./xml-document/construct";
import {behaveAsHTMLDocument} from "./html-document/behave";
behaveAsHTMLDocument(XMLDocument);