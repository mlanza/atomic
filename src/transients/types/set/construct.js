import Set from "set";

export function set(entries){
  return new Set(entries || []);
}

export function emptySet(){
  return new Set();
}
