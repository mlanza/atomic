export * from "./nil/construct";
import Nil from "./nil/construct";
export default Nil;
import behave from "./nil/behave";
behave(Nil);

export function isNil(x){
  return x == null;
}

export function isSome(x){
  return x != null;
}