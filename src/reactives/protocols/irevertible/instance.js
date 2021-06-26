import {protocol} from "atomic/core";
export const IRevertible = protocol({
  undo: null,
  redo: null,
  flush: null,
  undoable: null,
  redoable: null
});