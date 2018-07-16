import {effect, overload, constantly, identity} from '../../core';
import {each} from '../../types/lazy-seq/concrete';
import {implement} from '../protocol';
import {IDeref, IMiddleware} from '../../protocols';

function handle(self, command, next){
  return self.effects(self.state, command, next);
}

export default effect(
  implement(IMiddleware, {handle}));