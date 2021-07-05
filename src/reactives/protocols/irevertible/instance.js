import * as _ from "atomic/core";
export const IRevertible = _.protocol({
  undo: null,
  redo: null,
  flush: null,
  undoable: null,
  redoable: null
});
