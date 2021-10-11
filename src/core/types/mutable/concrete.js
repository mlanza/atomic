export function mutate(self, effect){
  effect(self.obj);
  return self.obj;
}
