import {EMPTY} from '../../types/empty/construct';

export default function IndexedNodeList(nodes, start){
  this.nodes = nodes;
  this.start = start;
}

export function indexedNodeList(nodes, start){
  return nodes.length > start ? new IndexedNodeList(nodes, start) : EMPTY;
}