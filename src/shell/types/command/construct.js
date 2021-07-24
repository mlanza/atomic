export function Command(type, attrs){
  this.type = type;
  this.attrs = attrs;
}

export function constructs(Type){
  return function message(type){
    return function(args, options){
      return new Type(type, Object.assign({args: args || []}, options));
    }
  }
}

export const command = constructs(Command);
