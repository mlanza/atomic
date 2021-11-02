export function vreset(self, state){
  self.state = state;
}

export function vswap(self, f){
  return self.state = f(self.state);
}
