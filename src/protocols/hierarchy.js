import {flip} from '../core';
import {protocol} from '../protocol';
export const Hierarchy = protocol({
  parent: null,
  closest: null,
  remove: null
});
export const parent = Hierarchy.parent;
export const closest = flip(Hierarchy.closest, 2);
export const remove = Hierarchy.remove;
export default Hierarchy;