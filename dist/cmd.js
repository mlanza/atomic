export async function cmds(){
  const [_, dom, $, imm, sh, repos, html, svg, vd, t, mut] = await Promise.all([
    import('./atomic_/core.js'),
    import('./atomic_/dom.js'),
    import('./atomic_/reactives.js'),
    import('./atomic_/immutables.js'),
    import('./atomic_/shell.js'),
    import('./atomic_/repos.js'),
    import('./atomic_/html.js'),
    import('./atomic_/svg.js'),
    import('./atomic_/validates.js'),
    import('./atomic_/transducers.js'),
    import('./atomic_/transients.js')
  ]);
  return {
    _: _.default,
    dom: dom.default,
    $: $.default,
    imm: imm.default,
    sh: sh.default,
    repos: repos.default,
    html: html.default,
    svg: svg.default,
    vd: vd.default,
    t: t.default,
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
