import {effect} from "../../core";
import {implement} from '../protocol';
import {IHierarchy, IHierarchicalSet} from '../../protocols';
import {mapping, mapcatting} from '../lazyseq/concrete';
import {series} from '../series';

const parent      = mapping(IHierarchy.parent);
const children    = mapcatting(IHierarchy.children);
const nextSibling = mapping(IHierarchy.nextSibling);
const prevSibling = mapping(IHierarchy.prevSibling);

export const hierarchical = implement(IHierarchicalSet, {parent, children, nextSibling, prevSibling});

export default effect(
  series,
  hierarchical);