import Symbol from "symbol";

export function Lens(root, path){
  this.root = root;
  this.path = path;
}

Lens.prototype[Symbol.toStringTag] = "Lens";

export function lens(root, path){
  return new Lens(root, path || []);
}
