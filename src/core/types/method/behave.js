import {does} from "../../core";
import {implement} from '../protocol';
import {apply} from '../function/concrete';
import {IFn, IMatch} from '../../protocols';

function invoke(self, args){
  return apply(self.f, args);
}

function matches(self, args){
  return apply(self.pred, args);
}

export default does(
  implement(IMatch, {matches}),
  implement(IFn, {invoke}));