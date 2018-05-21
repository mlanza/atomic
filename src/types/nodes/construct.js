export default function Nodes(nodes){
  this.nodes = nodes;
}

export function nodes(nodes){
  return new Nodes(nodes);
}