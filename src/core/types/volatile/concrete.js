export function vreset(self, state){
  return self.state = state;
}

export function vswap(self, f){
  return self.state = f(self.state);
}
