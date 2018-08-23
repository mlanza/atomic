import {IPublish, IEvented, ICollection, IYank, IHierarchy} from '../../protocols';
import {lazyPub} from "../lazy-pub/construct";
import {publisher} from "../publisher/construct";
import {identity, overload, partial} from "../../core";

export function replaceWith(self, other){
  const parent = IHierarchy.parent(self);
  parent.replaceChild(other, self);
}

function event2(el, key){
  const sink = publisher(), callback = partial(IPublish.pub, sink);
  return lazyPub(sink, function(state){
    const f = state === "active" ? IEvented.on : IEvented.off;
    f(el, key, callback);
  });
}

function event3(el, key, selector){
  const sink = publisher(), callback = partial(IPublish.pub, sink);
  return lazyPub(sink, function(state){
    if (state === "active") {
      IEvented.on(el, key, selector, callback);
    } else {
      IEvented.off(el, key, callback);
    }
  });
}

export const event = overload(null, null, event2, event3);

export function click(el){
  return event(el, "click");
}

export function isVisible(el){
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export function isInput(el){
  return el.matches("input,textarea,select");
}

export function enable(self, enabled){
  self.disabled = !enabled;
  return self;
}