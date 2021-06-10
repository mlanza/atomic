import Symbol from "symbol";

export function Nil(){
}

export function isNil(x){
  return x == null;
}

export function isSome(x){
  return x != null;
}

export function nil(){
  return null;
}

Object.defineProperty(Nil, Symbol.hasInstance, {
  value: isNil
});