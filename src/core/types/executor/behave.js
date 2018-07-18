import {effect, partial} from '../../core';
import {implement} from '../protocol';
import {apply} from '../../types/function/concrete';
import {dispatch} from "../../protocols/idispatch/concrete";
import {deref} from "../../protocols/ideref/concrete";
import {config} from "../../protocols/iconfigured/concrete";
import {swap} from "../../protocols/iswap/concrete";
import {get} from "../../protocols/ilookup/concrete";
import {IMiddleware} from '../../protocols';

function handle(self, event, next){
  const past = deref(self.state);
  swap(self.state, function(memo){
    return apply(self.execute, memo, get(event, "args"));
  });
  const present = deref(self.state);
  self.react && self.react(event, partial(dispatch, self.bus), present, past, config(self.bus));
  next(event);
}

export default effect(
  implement(IMiddleware, {handle}));