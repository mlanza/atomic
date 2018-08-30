export default function Issue(message){
  this.message = message;
}

export function issue(message){
  return new Issue(message || "invalid");
}