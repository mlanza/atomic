export * from "./element/construct";
export * from "./element/concrete";
import {Element} from "./element/construct";
import {behaveAsElement} from "./element/behave";
behaveAsElement(Window);
behaveAsElement(Element);
behaveAsElement(Text);