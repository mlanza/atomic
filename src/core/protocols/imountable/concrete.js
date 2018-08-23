import {ISubscribe, IDeref} from '../../protocols';
import IMountable from "./instance";
import {includes} from "../../protocols/iinclusive/concrete";
import {trigger} from "../../protocols/ievented/concrete";
import {specify, satisfies} from "../../types/protocol";
import {partial} from "../../types/function/concrete";
import {hist} from '../../../signals';
import {doto, overload, noop, does} from '../../../core/core';
import {_ as v} from "param.macro";

export const mounting = IMountable.mounting;
export const mounted = IMountable.mounted;

export function mount(self, parent){
  mounting(self, parent);
  IMountable.mount(self, parent);
  mounted(self, parent);
  return self;
}

export function mounts(self, context){
  function mounting(self, parent){
    trigger(self, "mounting", {bubbles: true, detail: {parent, context}});
  }
  function mount(self, parent){
    parent.appendChild(self);
  }
  function mounted(self, parent){
    trigger(self, "mounted", {bubbles: true, detail: {parent, context}});
  }
  return doto(self,
    specify(IMountable, {mounting, mount, mounted}));
}

function mutate3(self, state, f){
  ISubscribe.sub(state, partial(f, self));
  return self;
}

function mutate2(state, f){
  return mutate3(v, state, f);
}

export const mutate = overload(null, null, mutate2, mutate3);