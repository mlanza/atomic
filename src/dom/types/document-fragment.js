export * from "./document-fragment/construct.js";
import {DocumentFragment} from "dom";
import {behaveAsDocumentFragment} from "./document-fragment/behave.js";
behaveAsDocumentFragment(DocumentFragment);