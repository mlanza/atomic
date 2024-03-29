export * from "./element/construct.js";
export * from "./element/concrete.js";
import behave from "./element/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Window: behave, Element: behave, Text: behave});
behave(Window);
behave(Element);
behave(Text);
