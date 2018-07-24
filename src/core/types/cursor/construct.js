export default function Cursor(source, path){
  this.source = source;
  this.path = path;
}

export function cursor(source, path){
  return new Cursor(source, path);
}