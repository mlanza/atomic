export function Nil(){
}

export function nil(){
  return null;
}

export default Nil;

export function isNil(x){
  return x == null;
}

export function isSome(x){
  return x != null;
}