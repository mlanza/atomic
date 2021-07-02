export * from "./document-fragment/construct.js";
import {DocumentFragment} from "dom";
import behave from "./document-fragment/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {DocumentFragment: behave});
behave(DocumentFragment);
