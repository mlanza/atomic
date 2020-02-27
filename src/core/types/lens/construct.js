export function Lens(root, path){
  this.root = root;
  this.path = path;
}

export function lens(root, path){
  return new Lens(root, path || []);
}

function from({root, path}){
  return lens(root, path);
}

Lens.create = lens;
Lens.from = from;