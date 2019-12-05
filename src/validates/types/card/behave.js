import {implement, does, isInteger, between, count, IBounds, IInclusive} from 'atomic/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';

function start(self){
  return self.least;
}

function end(self){
  return self.most;
}

function includes(self, value){
  return isInteger(value) && between(self, value);
}

function check(self, coll){
  const n = count(coll);
  return n < self.least || n > self.most ? [issue(self)] : null;
}

export const behaveAsCardinality = does(
  implement(ICheckable, {check}),
  implement(IInclusive, {includes}),
  implement(IBounds, {start, end}));