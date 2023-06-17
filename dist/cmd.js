export async function cmds(){
  const [_, dom, $, sh, vd, mut] = await Promise.all([
    import('./atomic_/core.js'),
    import('./atomic_/dom.js'),
    import('./atomic_/reactives.js'),
    import('./atomic_/shell.js'),
    import('./atomic_/validates.js'),
    import('./atomic_/transients.js')
  ]);
  return {
    _: _.default,
    dom: dom.default,
    $: $.default,
    sh: sh.default,
    vd: vd.default,
    mut: mut.default
  };
}

export function cmd(target){
  cmds().then(function(cmds){
    Object.assign(target || globalThis, cmds);
    console.log("Commands loaded", cmds);
  });
}

window.cmd = cmd;
