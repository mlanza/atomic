export function Lens(root, path){
  this.root = root;
  this.path = path;
}

export function lens(root, path){
  return new Lens(root, path || []);
}
