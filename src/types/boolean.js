export * from "./boolean/construct";
import Boolean from "./boolean/construct";
//import behave from "./boolean/behave";
//behave(Boolean);

export function isBoolean(self){
  return Boolean(self) === self;
}

export function not(self){
  return !self;
}

export function isTrue(self){
  return self === true;
}

export function isFalse(self){
  return self === false;
}