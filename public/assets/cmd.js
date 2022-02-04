export async function cmds(){
  const [_, dom, $, imm, sh, repos, html, svg, vd, t, mut] = await Promise.all([
    import('./vendor/@atomic/core.js'),
    import('./vendor/@atomic/dom.js'),
    import('./vendor/@atomic/reactives.js'),
    import('./vendor/@atomic/immutables.js'),
    import('./vendor/@atomic/shell.js'),
    import('./vendor/@atomic/repos.js'),
    import('./vendor/@atomic/html.js'),
    import('./vendor/@atomic/svg.js'),
    import('./vendor/@atomic/validates.js'),
    import('./vendor/@atomic/transducers.js'),
    import('./vendor/@atomic/transients.js')
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
