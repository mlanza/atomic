import {IRevertible} from "./instance.js";
import { overload } from "../../core.js";
export const crunch = IRevertible.crunch;
export const crunchable = IRevertible.crunchable;
export const undo = IRevertible.undo;
export const undoable = IRevertible.undoable;
export const redo = IRevertible.redo;
export const redoable = IRevertible.redoable;
export const revert = IRevertible.revert;
export const revertible = IRevertible.revertible;
export const flush = IRevertible.flush;
export const flushable = IRevertible.flushable;
export const revision = overload(null, function(self){
  return IRevertible.revision(self, self.pos);
}, IRevertible.revision);
