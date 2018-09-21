import * as core from "cloe/core";
import * as immutables from "cloe/immutables";
import * as transducers from "cloe/transducers";
import * as reactives from "cloe/reactives";
import * as requests from "cloe/requests";

const _core = core.impart(core, core.partly);
const _immutables = core.impart(immutables, core.partly);
const _requests = core.impart(requests, core.partly);
const _reactives = core.impart(reactives, core.partly);
const _transducers = core.impart(transducers, core.partly);

export default Object.assign(
  core.placeholder,
  _core,
  _immutables, {
    observable: _reactives.observable,
    click: _reactives.click,
    requests: _requests,
    reactives: _reactives,
    transducers: _transducers
  });