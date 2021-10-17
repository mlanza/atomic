export function Multimethod(dispatch, methods, fallback){
  this.dispatch = dispatch;
  this.methods = methods;
  this.fallback = fallback;
}

export function multimethod(dispatch, fallback){
  return new Multimethod(dispatch, {}, fallback);
}
