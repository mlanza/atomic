export function isDate(self){
  return self.constructor === Date;
}

export function ceil(self){
  return new Date(self.getFullYear(), self.getMonth(), self.getDate(), 23, 59, 59, 999);
}

export function floor(self){
  return new Date(self.getFullYear(), self.getMonth(), self.getDate());
}

export function startOfMonth(dt){
  const d = new Date(dt.valueOf());
  d.setDate(1);
  return d;
}

export function endOfMonth(dt){
  const d = new Date(dt.valueOf());
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return d;
}