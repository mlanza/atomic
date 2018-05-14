export * from "./boolean/construct";
import Boolean from "./boolean/construct";
//import behave from "./boolean/behave";
//behave(Boolean);

export function isBoolean(self){
  return Boolean(self) === self;
}

export function not(x){
  return !x;
}