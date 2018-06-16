export * from "./error/construct";
export default Error;
import Error from "./error/construct";
import behave from "./error/behave";
behave(Error);