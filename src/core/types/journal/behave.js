import {identity, overload, does, slice} from "../../core.js";
import {implement} from "../protocol.js";
import * as p from "../../protocols/concrete.js";
import {IRevertible, IAssociative, ILookup, IFunctor, IDeref} from "../../protocols.js";
import {Journal} from "./construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function undo(self){
  const pos = self.pos + 1;
  return undoable(self) ? new Journal(pos, self.max, self.history, self.history[pos]) : self;
}

function redo(self){
  const pos = self.pos - 1;
  return redoable(self) ? new Journal(pos, self.max, self.history, self.history[pos]) : self;
}

function flush(self){
  return new Journal(0, self.max, [self.state], self.state);
}

function undoable(self){
  return self.pos < p.count(self.history);
}

function redoable(self){
  return self.pos > 0;
}

function deref(self){
  return self.state;
}

function fmap(self, f){
  const revised = f(self.state);
  return new Journal(0, self.max, p.prepend(self.pos ? slice(self.history, self.pos) : self.history, revised), revised);
}

function revision(self, pos){
  return [self.history[pos], self.history[pos + 1] || null];
}

export default does(
  keying("Journal"),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}),
  implement(IRevertible, {undo, redo, flush, undoable, redoable, revision}));
