export async function cmds(){
  const [_, dom, $, imm, sh, repos, html, svg, vd, t, mut] = await Promise.all([
    import('./@atomic/core.js'),
    import('./@atomic/dom.js'),
    import('./@atomic/reactives.js'),
    import('./@atomic/immutables.js'),
    import('./@atomic/shell.js'),
    import('./@atomic/repos.js'),
    import('./@atomic/html.js'),
    import('./@atomic/svg.js'),
    import('./@atomic/validates.js'),
    import('./@atomic/transducers.js'),
    import('./@atomic/transients.js')
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
