export * from "./element/construct";
import Element from "./element/construct";
export default Element;
import behave from "./element/behave";
behave(Element);
behave(Text);