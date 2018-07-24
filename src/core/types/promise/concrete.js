import Promise from "./construct";

export function resolve(value){
  return Promise.resolve(value);
}

export function reject(value){
  return Promise.reject(value);
}

export function all(value){
  return Promise.all(value);
}