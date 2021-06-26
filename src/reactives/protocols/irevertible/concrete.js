import {IRevertible} from "./instance.js";
export const undo = IRevertible.undo;
export const undoable = IRevertible.undoable;
export const redo = IRevertible.redo;
export const redoable = IRevertible.redoable;
export const flush = IRevertible.flush;