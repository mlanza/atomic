function add(a, b){
  return a + b;
}

function get(self, key){
  return self[key];
}

function assoc(self, key, value){
  self[key]=value;
  return self;
}


function chain2(x, a){
  return a(x);
}

function chain3(x, a, b){
  return b(a(x));
}

const r = 1 |> add(3)
console.log(r);

//const mtl = {} |> assoc(_, "name", "Mario"), assoc(_, "surname", "Lanza"))

///const lw = it |> assoc(_, "name", "Lance");

//const plus2 = add(_, 2);

//console.log({mtl, lw: lw({})});
