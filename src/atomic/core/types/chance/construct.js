export class Chance {
  constructor(seed, hash) {
    this.seed = seed;
    this.hash = hash;
  }

  random(){
    let h = this.hash;
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    this.hash = h;
    return (h >>> 0) / 4294967296; // Ensure value between 0 and 1
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(serialized) {
    const {seed, hash} = JSON.parse(serialized);
    return chance(seed, hash);
  }
}

export function chance(seed = Math.random(), hash = 1779033703 ^ seed){
  const chance = new Chance(seed, hash);
  chance.random = chance.random.bind(chance);
  return chance; //making it a drop-in replacement for Math.random
}
