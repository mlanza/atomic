import {chain, doto, flip, compose, constantly, multiarity, complement, partial} from './core/function.js';
import {reduced} from './core/reduced.js';
import {eq, gt, lt} from './compare.js';
import {join} from './array.js';
import {deref} from './protocols/deref.js';
import {append, prepend} from './protocols/extend.js';
import Extend from './protocols/extend.js';
import Seq from './protocols/seq.js';
import {each} from './protocols/seq.js';
import {log} from './log.js';
import * as dom from './dom.js';
import {repeatedly, repeat, some, isEvery,
  take as $take, 
  map as $map, 
  filter as $filter, 
  remove as $remove, 
  takeWhile as $takeWhile, 
  dropWhile as $dropWhile}
from './core/cons.js';
import {inc, increasingly, range} from './number.js';
import {transduce, into, map, take, drop, filter, takeNth} from './core/transduce.js';

window.onload = function(){
  var div  = dom.tag('div'), 
      span = dom.tag('span'),
      body = dom.first("body", document);
  append(div({id: 'branding'}, span("Greetings!")), body);
  dom.hide(body);  
  each(log, ["ace", "king", "queen"]);
  chain(body, doto(dom.setAttr(['id', 'main']), dom.setAttr(['id', 'main']), dom.addClass('post'), dom.addClass('entry'), dom.removeClass('entry')));
  chain(body, dom.getAttr('id'), eq('main'), log);
  chain(body, dom.closest("html"), log);
  chain(["Moe"], append("Howard"), join(" "), log);
  chain(["Curly"], append("Howard"), join(" "), log);
  log(append({fname: "Moe"}, {lname: "Howard"}));
  log(append(3, [1,2]))
  log(prepend(0, [1, 2]));
  chain(into([], "Polo"), log);
  chain(into("Marco ", "Polo"), log);
  chain(into([], repeat(5, "X")), log);
  chain(some(gt(5), range(10)), log);
  chain(isEvery(gt(5), range(10)), log);
  chain(transduce(takeNth(2), Extend.append, [], range(10)), partial(log, "take-nth"));
  chain(into([], repeatedly(0, constantly(1))), log);
  chain(into([], repeatedly(10, constantly(2))), log);
  chain(into([], $take(5, range(10))), partial(log, "$take"));
  chain(into([], $filter(gt(5), range(10))), partial(log, "$filter > 5"));
  chain(into([], $remove(gt(5), range(10))), partial(log, "$remove > 5"));
  chain(into([], $takeWhile(lt(5), range(10))), partial(log, "$takeWhile < 5"));
  chain(into([], $dropWhile(gt(5), range(10))), partial(log, "$dropWhile > 5"));
  chain(transduce(take(5), Extend.append, [], increasingly(0)), log);
  chain(into([], $map(inc, range(1, 5))), partial(log, "$map"));
  chain(transduce(map(inc), Extend.append, [], [10, 11, 12]), log);
  chain(transduce(filter(gt(6)), Extend.append, "", [5, 6, 7, 8, 9]), log);
  chain(transduce(compose(filter(gt(6)), map(inc), take(2)), Extend.append, [], [5, 6, 7, 8, 9]), log);
  chain(transduce(take(10), Extend.append, [], range(7, 15)), log);
  chain(into([], range(5)), log);
  dom.show(body);
  chain(body, dom.first("span"), dom.text, log);
}
