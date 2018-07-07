export function Pipeline(fs){
  this.fs = fs;
}

export function pipeline(fs){
  return new Pipeline(fs || []);
}

export default Pipeline;

Pipeline.from = pipeline;