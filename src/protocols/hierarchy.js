import {protocol} from '../protocol';
export const Hierarchy = protocol({
  parent: null,
  closest: null,
  detach: null
});
export const parent = Hierarchy.parent;
export const closest = Hierarchy.closest;
export const detach = Hierarchy.detach;
export default Hierarchy;