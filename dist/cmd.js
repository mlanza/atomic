import _ from "./atomic_/core.js";
import $ from "./atomic_/shell.js";

export const registry = {};
const params = new URLSearchParams(location.search);
const monitor = params.get("monitor")?.split(",");
const nomonitor = params.get("nomonitor")?.split(",");

const monitors = monitor ? function(key){
  return monitor.includes("*") || monitor.includes(key);
} : nomonitor ? function(key){
  return !nomonitor.includes(key);
} : _.noop;

function log(...args){
  const l = registry.log || _.log;
  l(...args);
}

function monitoring(symbol, object){
  if (monitors(symbol) && _.satisfies($.ISubscribe, object)) {
    $.sub(object, _.partial(log, symbol));
  }
}

function register(symbols){
  Object.assign(registry, symbols);
}

function registerWithMonitoring(symbols){
  register(symbols);
  for(const [symbol, object] of Object.entries(symbols)){
    monitoring(symbol, object);
  }
}

export const reg = monitors === _.noop ? register : registerWithMonitoring;

reg({_, $});

function cmd(target = globalThis){
  Object.assign(target, registry);
  log("Commands loaded", registry);
}

Object.assign(globalThis, {reg, cmd});
