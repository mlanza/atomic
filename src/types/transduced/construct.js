import {first, rest} from '../../protocols/iseq';
import {seq} from '../../protocols/iseqable';
import {reduce} from '../../protocols/ireduce';
import {next} from '../../protocols/inext';
import {EMPTY} from '../empty/construct';
import {cons} from '../list';

export function Transduced(xf, coll){
  this.xf = xf;
  this.coll = coll;
}

Transduced.prototype.materialize = function materialize(){
  if (this.mat) return;
  var memo = [],
      xs = seq(this.coll),
      f  = this.xf(function(memo, value){
        return memo.concat([value]);
      });
  while(xs){
    memo = f(memo, first(xs));
    xs = next(xs);
  }
  this.mat = memo.length ? xs ? reduce(memo.reverse(), function(memo, x){
    return cons(x, memo);
  }, transduced(this.xf, xs)) : memo : EMPTY;
}

export function transduced(xf, coll){
  return new Transduced(xf, coll);
}

export default Transduced;