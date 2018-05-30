import {effect} from "../../core";
import {implement} from '../protocol';
import {IHierarchy, IHierarchicalSet, IContent} from '../../protocols';
import {mapping, mapcatting} from '../lazyseq/concrete';
import {series} from '../series';

const parent      = mapping(IHierarchy.parent);
const children    = mapcatting(IHierarchy.children);
const nextSibling = mapping(IHierarchy.nextSibling);
const prevSibling = mapping(IHierarchy.prevSibling);
const contents    = mapcatting(IContent.contents);

export const ihierarchicalset = implement(IHierarchicalSet, {parent, children, nextSibling, prevSibling});
export const icontent = implement(IContent, {contents});

export default effect(
  series,
  ihierarchicalset,
  icontent);