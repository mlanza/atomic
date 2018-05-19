export function Aspectable(how, exec, before, after){
  this.how  = how;
  this.exec = exec;
  this.before = before;
  this.after = after;
}

export function provideConstructor(pipeline){

  return function aspectable(how, exec){
    return new Aspectable(how, exec, pipeline(how), pipeline(how));
  }

}

export default Aspectable;