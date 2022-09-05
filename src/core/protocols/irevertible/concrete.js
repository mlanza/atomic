import {IRevertible} from "./instance.js";
import { overload } from "../../core.js";
export const undo = IRevertible.undo;
export const undoable = IRevertible.undoable;
export const redo = IRevertible.redo;
export const redoable = IRevertible.redoable;
export const flush = IRevertible.flush;
export const revision = overload(null, function(self){
  return IRevertible.revision(self, self.pos);
}, IRevertible.revision);
