export function mutate(self, effect){
  effect(self.state);
  return self.state;
}
