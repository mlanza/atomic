import Set from "set";

export const TransientSet = Set;

export function transientSet(entries){
  return new TransientSet(entries || []);
}

export function emptyTransientSet(){
  return new TransientSet();
}