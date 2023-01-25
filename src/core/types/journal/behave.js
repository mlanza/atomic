import {identity, overload, does, slice} from "../../core.js";
import {implement} from "../protocol.js";
import * as p from "../../protocols/concrete.js";
import {IRevertible, IResettable, IAssociative, ILookup, IFunctor, IDeref, ICounted} from "../../protocols.js";
import {Journal} from "./construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {splice} from "../lazy-seq/concrete.js";
import {toArray} from "../array/concrete.js";

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

function flushable(self){
  return p.count(self.history) > 1;
}

const crunchable = flushable;

function crunch(self){
  return new Journal(self.pos, self.max, toArray(splice(self.history, p.count(self.history) - 1, 1, [])), self.state);
}

function undoable(self){
  return self.pos + 1 < p.count(self.history);
}

function redoable(self){
  return self.pos > 0;
}

function reset(self){
  const at = p.count(self.history) - 1,
        state = p.nth(self.history, at);
  return new Journal(at, self.max, self.history, state);
}

function resettable(self){
  return self.pos !== p.count(self.history) - 1;
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
  implement(IResettable, {reset, resettable}),
  implement(IRevertible, {undo, redo, flush, crunch, flushable, crunchable, undoable, redoable, revision}));
