import {ISubscribe, IDeref} from '../../protocols';
import IMountable from "./instance";
import {trigger} from "../../protocols/ievented/concrete";
import {specify, satisfies} from "../../types/protocol";
import {partial} from "../../types/function/concrete";
import {hist} from '../../../signals';
import {doto, overload, noop} from '../../../core/core';
import {_ as v} from "param.macro";

export const mounting = IMountable.mounting;
export const mounted = IMountable.mounted;

export function mount(self, parent){
  mounting(self);
  IMountable.mount(self, parent);
  mounted(self);
  return self;
}

function mounts1(state){
  return mounts2(v, state);
}

function mounts2(self, state){
  return mounts3(self, state, "updated mounting");
}

function mounts3(self, state, events){
  function mounting(self){
    trigger(self, "mounting", {bubbles: false, detail: {present: IDeref.deref(state)}});
  }
  function mount(self, parent){
    parent.appendChild(self);
  }
  function mounted(self){
    const changed = hist(state);
    ISubscribe.sub(changed, function([present, past]){
      if (past && past !== present) {
        trigger(self, "updated", {bubbles: false, detail: {present: present, past: past}});
      }
    });
    trigger(self, "mounted", {bubbles: false, detail: {present: IDeref.deref(state)}});
  }
  return doto(self,
    specify(IMountable, {mounting, mount, mounted}));
}

export const mounts = overload(null, mounts1, mounts2, mounts3);

function mutate3(self, state, f){
  ISubscribe.sub(state, partial(f, self));
  return self;
}

function mutate2(state, f){
  return mutate3(v, state, f);
}

export const mutate = overload(null, null, mutate2, mutate3);