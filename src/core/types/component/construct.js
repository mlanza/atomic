export default function Component(config, input, output){
  this.config = config;
  this.input = input;
  this.output = output;
}

export function component(config, input, output){
  return new Component(config, input, output);
}