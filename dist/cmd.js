const registry = {};

export function reg(symbol, path){
  if (arguments.length == 1) {
    Object.assign(registry, symbol);
  } else {
    registry[symbol] = path;
  }
}

async function cmds(){
  const mods = await Promise.all(Object.entries(registry).map(function([symbol, path]){
    return typeof path == "string" ? import(path).then(function(mod){
      return [symbol, mod];
    }) : Promise.resolve([symbol, {default: path}]);
  }));
  return mods.reduce(function(memo, [symbol, mod]){
    memo[symbol] = mod.default;
    return memo;
  }, {});
}

export function cmd(target){
  cmds().then(function(cmds){
    Object.assign(target || globalThis, cmds);
    console.log("Commands loaded", cmds);
  });
}

reg("_", "./atomic_/core.js");
reg("dom", "./atomic_/dom.js");
reg("$", "./atomic_/reactives.js");
reg("sh", "./atomic_/shell.js");
reg("vd", "./atomic_/validates.js");
reg("mut", "./atomic_/transients.js");

Object.assign(globalThis, {cmd});
