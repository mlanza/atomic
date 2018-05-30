import {effect} from "../../core";
import {implement} from '../protocol';
import {IHierarchy, IHierarchicalSet, IContent, ISeqable} from '../../protocols';
import {map, mapcat, remove, compact, distinct} from '../lazyseq/concrete';
import {series} from '../series';
import {nodes} from './construct';

function asNodes(map){
  return function(f){
    return function(coll){
      return nodes(distinct(compact(map(f, filter(function(el){
        return el !== document;
      }, ISeqable.seq(coll))))));
    }
  }
}

const mapping     = asNodes(map);
const mapcatting  = asNodes(mapcat);
const parent      = mapping(IHierarchy.parent);
const children    = mapcatting(IHierarchy.children);
const nextSibling = mapping(IHierarchy.nextSibling);
const prevSibling = mapping(IHierarchy.prevSibling);
const contents    = mapcatting(IContent.contents);

export const ihierarchicalset = implement(IHierarchicalSet, {parent, children, nextSibling, prevSibling});
export const icontent = implement(IContent, {contents});
export {mapping, mapcatting};

export default effect(
  series,
  ihierarchicalset,
  icontent);