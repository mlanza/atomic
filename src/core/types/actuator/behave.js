import {effect, overload, constantly, identity} from '../../core';
import {each} from '../../types/lazy-seq/concrete';
import {implement} from '../protocol';
import {IDeref, IMiddleware} from '../../protocols';

function handle(self, command, next){
  each(next, self.effects(IDeref.deref(self.state), command));
}

export default effect(
  implement(IMiddleware, {handle}));