export function Aspectable(how, exec, pre, post){
  this.how  = how;
  this.exec = exec;
  this.pre  = pre;
  this.post = post;
}

export function provideConstructor(pipeline){

  return function aspectable(how, exec){
    return new Aspectable(how, exec, pipeline(how), pipeline(how));
  }

}

export default Aspectable;