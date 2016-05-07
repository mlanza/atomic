export const unbind = Function.call.bind(Function.bind, Function.call);

export function isIdentical(a, b){
  return a === b;
}
export function identity(value){
  return value;
}
export function constructs(value) {
  return value.constructor;
}
