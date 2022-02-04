export default async function cmd(){
  const [_, imm, dom, $, sh, vd, t, mut] = await Promise.all([
    import('./vendor/@atomic/core.js'),
    import('./vendor/@atomic/immutables.js'),
    import('./vendor/@atomic/dom.js'),
    import('./vendor/@atomic/reactives.js'),
    import('./vendor/@atomic/shell.js'),
    import('./vendor/@atomic/validates.js'),
    import('./vendor/@atomic/transducers.js'),
    import('./vendor/@atomic/transients.js')
  ]);
  const cmds = {_: _.default, imm: imm.default, dom: dom.default, $: $.default, sh: sh.default, vd: vd.default, t: t.default, mut: mut.default};
  Object.assign(globalThis, cmds);
  cmds._.log("Commands loaded", cmds);
  return cmds;
}

window.cmd = cmd;
