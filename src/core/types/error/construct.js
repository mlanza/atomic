export function error(message){
  return new Error(message);
}

export function isError(self){
  return self && self instanceof Error;
}
