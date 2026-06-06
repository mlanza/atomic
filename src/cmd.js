import _ from "./atomic_/core.js";
import $ from "./atomic_/shell.js";
//#if _EXPERIMENTAL
import vd from "./atomic_/validates.js";
//#endif
import imm from "./atomic_/immutables.js";

const registry = {};
const params = new URLSearchParams(globalThis.location ? location.search : "");
const monitor = _.maybe(params.get("monitor"), _.split(_, ","));
const nomonitor = _.maybe(params.get("nomonitor"), _.split(_, ","));

const monitors = monitor ? function(key){
  return monitor.includes("*") || monitor.includes(key);
} : nomonitor ? function(key){
  return !nomonitor.includes(key);
} : _.constantly(false);

function reg0(){
  return Object.assign({}, registry);
}

function reg1(symbols, log = $.log){
  Object.assign(registry, symbols);
  for(const [symbol, object] of Object.entries(symbols)){
    if (!monitors(symbol)) continue;
    if (_.satisfies($.ISubscribe, object)) {
      $.sub(object, _.partial(log, symbol));
    } else {
      log(symbol, object);
    }
  }
}

export const reg = _.overload(reg0, reg1);

export function cmd(target = globalThis, log = $.log){
  Object.assign(target, registry);
  log("Loaded", registry);
}

export default cmd;

const dom = globalThis.document ? (await import("./atomic_/dom.js")).default : null;

//#if _EXPERIMENTAL
_.chain({_, $, imm, dom, vd}, _.compact, reg);
//#else
_.chain({_, $, imm, dom}, _.compact, reg);
//#endif

Object.assign(globalThis, {cmd, reg});
