import {effect} from '../../core';
import {implement} from '../protocol';
import {apply} from '../../types/function/concrete';
import {ISwap, IMiddleware, ILookup} from '../../protocols';

function handle(self, event, next){
  ISwap.swap(self.state, function(memo){
    return apply(self.execute, memo, ILookup.lookup(event, "args"));
  });
  next(event);
}

export default effect(
  implement(IMiddleware, {handle}));