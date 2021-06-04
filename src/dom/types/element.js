export * from "./element/construct";
export * from "./element/concrete";
import {Element} from "dom";
import {behaveAsElement} from "./element/behave";
behaveAsElement(Window);
behaveAsElement(Element);
behaveAsElement(Text);