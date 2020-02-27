export function error(message){
  return new Error(message);
}

Error.from = error;

export function isError(self){
  return self && self instanceof Error;
}