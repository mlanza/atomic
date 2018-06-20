export * from "./nestedattrs/construct";
//export * from "./nestedattrs/concrete";
import NestedAttrs from "./nestedattrs/construct";
import behave from "./nestedattrs/behave";
export default NestedAttrs;
behave(NestedAttrs);