export * from "./element/construct";
export * from "./element/concrete";
import Element from "./element/construct";
export default Element;
import behave from "./element/behave";
behave(Window);
behave(Element);
behave(Text);