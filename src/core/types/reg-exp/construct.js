export {RegExp};

export function isRegExp(self){
  return self.constructor === RegExp;
}