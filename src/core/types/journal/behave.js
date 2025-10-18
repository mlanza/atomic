import {identity, overload, does, slice} from "../../core.js";
import {implement} from "../protocol.js";
import * as p from "../../protocols/concrete.js";
import {IRevertible, IAssociative, ILookup, IFunctor, IDeref, ICounted, IIndexed} from "../../protocols.js";
import {Journal} from "./construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {splice} from "../lazy-seq/concrete.js";
import {toArray} from "../array/concrete.js";
import {clamp} from "../number/concrete.js";

function count(self){
  return ICounted.count(self.history);
}

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
  return crunchable(self) ? new Journal(self.pos, self.max, toArray(splice(self.history, p.count(self.history) - 1, 1, [])), self.state) : self;
}

function undoable(self){
  return self.pos + 1 < p.count(self.history);
}

function redoable(self){
  return self.pos > 0;
}

function revert(self){
  const at = p.count(self.history) - 1,
        state = p.nth(self.history, at);
  return new Journal(at, self.max, self.history, state);
}

function revertible(self){
  return self.pos !== p.count(self.history) - 1;
}

function deref(self){
  return self.state;
}

function fmap(self, f){
  const revised = f(self.state);
  return revised === self.state ? self : new Journal(0, self.max, p.prepend(self.pos ? slice(self.history, self.pos) : self.history, revised), revised);
}

function revision(self, pos){
  return [self.history[pos], self.history[pos + 1] || null];
}

function nth(self, pos){
  const n = clamp(pos, 0, self.max);
  const state = self.history[n] || null;
  return new Journal(n, self.max, self.history, state);
}

export default does(
  keying("Journal"),
  implement(ICounted, {count}),
  implement(IIndexed, {nth}),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}),
  implement(IRevertible, {undo, redo, revert, flush, crunch, flushable, crunchable, undoable, redoable, revertible, revision}));
