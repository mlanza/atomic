import _ from "./atomic_/core.js";
import $ from "./atomic_/shell.js";
//#if _EXPERIMENTAL
import vd from "./atomic_/validates.js";
//#endif
import imm from "./atomic_/immutables.js";

export const registry = {};
const params = new URLSearchParams(globalThis.location ? location.search : "");
const monitor = _.maybe(params.get("monitor"), _.split(_, ","));
const nomonitor = _.maybe(params.get("nomonitor"), _.split(_, ","));

const monitors = monitor ? function(key){
  return monitor.includes("*") || monitor.includes(key);
} : nomonitor ? function(key){
  return !nomonitor.includes(key);
} : _.noop;

function monitoring(symbol, object, log = $.log){
  if (monitors(symbol) && _.satisfies($.ISubscribe, object)) {
    $.sub(object, _.partial(log, symbol));
  }
}

function register(symbols){
  Object.assign(registry, symbols);
}

function registerWithMonitoring(symbols, log = $.log){
  register(symbols);
  for(const [symbol, object] of Object.entries(symbols)){
    monitoring(symbol, object, log);
  }
}

export const reg = monitors === _.noop ? register : registerWithMonitoring;

function cmd0({target = globalThis, log = $.log} = {}){
  Object.assign(target, registry);
  log("Loaded", registry);
}

async function cmd2(symbol, path, {target = globalThis, log = $.log} = {}){
  const obj = await import(path);
  target[symbol] = Object.keys(obj).length == 1 && obj.default != null ? obj.default : obj;
  log(`Loaded: ${symbol}`, obj);
}

export const cmd = _.overload(cmd0, cmd0, cmd2, cmd2);

export default cmd;

const dom = globalThis.document ? (await import("./atomic_/dom.js")).default : null;

//#if _EXPERIMENTAL
_.chain({_, $, imm, dom, vd}, _.compact, reg);
//#else
_.chain({_, $, imm, dom}, _.compact, reg);
//#endif

Object.assign(globalThis, {cmd});
