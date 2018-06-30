import {IPublish, ISubscribe, IDispatch, IMiddleware, IView, IStateful, IAppendable} from '../../protocols';
import {hist} from '../../../signals';
import {_ as v} from "param.macro";

export default function Component(view, bus, state, el){
  this.el = el;
  this.view = view;
  this.bus = bus;
  this.state = state;
}

export function component($view, $bus, state, el){
  const changed = hist(state);
  const bus = $bus(state);
  const view = $view(function(message){
    IDispatch.dispatch(bus, message);
  });
  ISubscribe.sub(changed, function([present, past]){
    if (past) {
      IView.patch(view, present, past, el);
    } else {
      IAppendable.append(el, IView.render(view, present));
    }
  });
  return new Component(view, bus, state, el);
}