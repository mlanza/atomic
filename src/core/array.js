import {unbind} from "./core.js";
import {reduced, Reduced} from "./reduced.js";

/*TODO consider that slice takes from, to args and that both are optional: slice(arr, from, to) in curried form slice (from, to, arr)
  as such an alternative to curry/subj would be config where all configurations are provided in the first call, thus...
    slice(1, 2, ["manny", "moe", "jack"]) invokes immediately as before
    slice(1, 2) awaits payload as usual
    slice(1) also awaits payload, not `to` as one might expect
  another alternative it to require configurations passed in as an object: 
    slice({from: 1, to: 2}, ["manny", "moe", "jack"]) invokes immediately as before
    slice({from: 1, to: 2}) awaits payload as usual
    slice({from: 1}) awaits payload as usual
  Both styles means that we cannot add additional options later as the last entry in both styles is missing the `to` arg.  With that being
  the case I prefer the former. We could make all options required:
    slice(1, 2, ["manny", "moe", "jack"]) invokes immediately as before
    slice(1, 2) awaits payload as usual
    slice(1) expects to option
    slice(1, null) uses default `to` value
  This is the trouble with currying variadic functions.  Another option is to create two versions of the curried function:
    slice(from, to, arr)
    through(from, arr);
  The main thing for curried functions is they must have a fixed number of arguments.  An options argument could be last.
  Another option is to allow partial with placeholders.
    through = partial(slice, _, null);
  Now what about options?  How do they work with currying?
*/

export const slice   = unbind(Array.prototype.slice);
export const splice  = unbind(Array.prototype.splice);
export const reverse = unbind(Array.prototype.reverse)
export const join    = unbind(Array.prototype.join);
export const concat  = unbind(Array.prototype.concat);

export function empty(){
  return [];
}

export function isEmpty(self){
  return self.length === 0;
}

export function append(self, item){
  return self.concat([item]);
}

export function prepend(self, item){
  return [item].concat(self);
}

export function each(self, f){
  var len = self.length, i = 0, result = null;
  while(i < len && !(result instanceof Reduced)){
    result = f(self[i++]);
  }
}

export function reduce(self, f, init) {
  var len = self.length, i = 0, memo = init;
  while(i < len && !(memo instanceof Reduced)){
    memo = f(memo, self[i++]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function first(self, len){
  return len ? slice(self, 0, len) : self[0];
}

export function last(self, len){
  return len ? slice(self, self.length - len) : self[self.length - 1];
}

export function initial(self, offset){
  return slice(self, 0, self.length - (offset || 1));
}

export function rest(self, idx){
  return slice(self, idx || 1);
}
