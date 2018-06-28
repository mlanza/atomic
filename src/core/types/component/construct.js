import {IPublish, ISubscribe, IDispatch, IMiddleware, IView} from '../../protocols';
import {observable} from '../observable';
import {publisher} from '../publisher';
import {commandBus} from '../command-bus';
import {messageHandler} from '../message-handler';
import {messageProcessor} from '../message-processor';
import {hist} from '../../../signals';
import {_ as v} from "param.macro";

export default function Component(view, bus, publ, el){
  this.el = el;
  this.view = view;
  this.bus = bus;
  this.publ = publ;
}

export function component(create, el){
  const publ = publisher();
  const view = create(function(message){
    IDispatch.dispatch(bus, message);
  });
  const commands = IView.commands(view);
  const events = IView.events(view);
  const init = IView.init(view);
  const state = observable(init);
  const changed = hist(state);
  const bus = commandBus([
    messageHandler(commands(state)),
    messageHandler(events(state)),
    messageProcessor(IPublish.pub(publ, v))
  ]);
  ISubscribe.sub(changed, function([present, past]){
    if (past) {
      IView.patch(view, present, past, el);
    } else {
      el.appendChild(IView.render(view, present));
    }
  });
  return new Component(view, bus, publ, el);
}