export * from "./element/construct.js";
export * from "./element/concrete.js";
import {Window, Element, Text} from "dom";
import behave from "./element/behave.js";
behave(Window);
behave(Element);
behave(Text);