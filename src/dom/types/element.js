export * from "./element/construct";
export * from "./element/concrete";
import {Window, Element, Text} from "dom";
import {behaveAsElement} from "./element/behave";
behaveAsElement(Window);
behaveAsElement(Element);
behaveAsElement(Text);