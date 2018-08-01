import {IPublish, IEvented, ICollection, IYank, IHierarchy} from '../../protocols';
import {lazyPub} from "../lazy-pub/construct";
import {identity, overload} from "../../core";

export function replaceWith(self, other){
  const parent = IHierarchy.parent(self);
  parent.replaceChild(other, self);
}

function event2(el, key){
  return event3(el, key, {});
}

function event3(el, key, options){
  return lazyPub(function(sink){
    function callback(e){
      IPublish.pub(sink, e);
    }
    function activate(){
      IEvented.on(el, key, callback);
    }
    function deactivate(){
      IEvented.off(el, key, callback);
    }
    return {activate, deactivate};
  });
}

function event4(el, key, selector, options){
  return lazyPub(function(sink){
    function callback(e){
      IPublish.pub(sink, e);
    }
    function activate(){
      IEvented.on(el, key, selector, callback);
    }
    function deactivate(){
      IEvented.off(el, key, callback);
    }
    return {activate, deactivate};
  });
}

export const event = overload(null, null, event2, event3, event4);

export function click(el, options){
  return event(el, "click", options);
}