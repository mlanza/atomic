export * from "./lazypub/construct";
import LazyPublication from "./lazypub/construct";
export default LazyPublication;
import behave from "./lazypub/behave";
behave(LazyPublication);