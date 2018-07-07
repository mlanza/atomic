import {ISubscribe, IAppendable} from '../../protocols';
import IView from "./instance";
import {hist} from '../../../signals';

export const render = IView.render;
export const patch = IView.patch;
export const mount = IView.mount;

export const mounts = function(state, parent){
  const changed = hist(state);
  return function(self){
    return ISubscribe.sub(changed, function([present, past]){
      if (!past) {
        IAppendable.append(parent, render(self, present));
      } else if (past !== present) {
        patch(self, present, past);
      }
    });
  }
}