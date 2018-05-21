import {comp} from '../../types/function';
import {EMPTY} from '../../types/empty';
import {seq} from '../../protocols/iseqable';
import * as m  from '../../map';

export default function Nodes(nodes){
  this.nodes = nodes;
}

export function nodes(nodes){
  return seq(nodes) ? new Nodes(nodes) : EMPTY;
}

export const toNodes     = comp(nodes, m.distinct, m.compact, m.map);
export const toFlatNodes = comp(nodes, m.distinct, m.compact, m.mapcat);
