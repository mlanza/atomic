export function InvalidHostElementError(el, selector){
  this.el = el;
  this.selector = selector;
}

function toString(){
  return `Element "${this.el.tagName}" failed to match "${this.selector}".`;
}

InvalidHostElementError.prototype = Object.assign(new Error(), {toString});
