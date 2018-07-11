import {ISubscribe, IDeref, IView, IEvented} from '../../protocols';
import IMountable from "./instance";
import {on, trigger} from "../../protocols/ievented/concrete";
import {specify, satisfies} from "../../types/protocol";
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

function mountable2($self, state){
  return mountable3($self, state, "updated mounting");
}

function mountable3($self, state, events){
  const self = $self(state);
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
  const patch = satisfies(IView, "patch", self);
  const patching = patch ? function(el){
    on(el, events, function(e){
      patch(self, e.detail.present, e.detail.past, this);
    });
  } : noop;
  return doto(IView.render(self, IDeref.deref(state)),
    specify(IMountable, {mounting, mount, mounted}),
    patching);
}

export const mountable = overload(null, null, mountable2, mountable3);