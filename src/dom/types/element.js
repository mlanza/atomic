export * from "./element/construct.js";
export * from "./element/concrete.js";
import {Window, Element, Text} from "dom";
import {behaveAsElement} from "./element/behave.js";
behaveAsElement(Window);
behaveAsElement(Element);
behaveAsElement(Text);