import * as core from "cloe/core";
import * as dom from "cloe/dom";
import * as immutables from "cloe/immutables";
import * as transducers from "cloe/transducers";
import * as reactives from "cloe/reactives";
import * as requests from "cloe/requests";

const _core = core.impart(core, core.partly);
const _dom = core.impart(dom, core.partly);
const _immutables = core.impart(immutables, core.partly);
const _requests = core.impart(requests, core.partly);
const _reactives = core.impart(reactives, core.partly);
const _transducers = core.impart(transducers, core.partly);

const placeholder = Object.assign(_core.placeholder, _core, _dom, _immutables, {
  observable: _reactives.observable,
  click: _reactives.click
});

export default Object.assign(placeholder, {
  core: _core,
  dom: _dom,
  immutables: _immutables,
  requests: _requests,
  reactives: _reactives,
  transducers: _transducers
});