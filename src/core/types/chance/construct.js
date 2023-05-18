import { guid } from "../guid/construct.js";

export function Chance(text){ //better if a phrase or sentence
  const seed = murmurHash3(text);
  this.text = text;
  this.random = simpleFastCounter32(seed(), seed());
}

export function chance(text = guid()){
  return new Chance(text);
}

//credit: https://www.delftstack.com/howto/javascript/javascript-random-seed-to-generate-random/

function murmurHash3(string) {
  let i = 0, hash;
  for (i, hash = 1779033703 ^ string.length; i < string.length; i++) {
      let bitwise_xor_from_character = hash ^ string.charCodeAt(i);
      hash = Math.imul(bitwise_xor_from_character, 3432918353);
      hash = hash << 13 | hash >>> 19;
  } return () => {
     // Return the hash that you can use as a seed
      hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
      return (hash ^= hash >>> 16) >>> 0;
  }
}

function simpleFastCounter32(seed_1, seed_2, seed_3, seed_4) {
  return () => {
    seed_1 >>>= 0; seed_2 >>>= 0; seed_3 >>>= 0; seed_4 >>>= 0;
    let cast32 = (seed_1 + seed_2) | 0;
    seed_1 = seed_2 ^ seed_2 >>> 9;
    seed_2 = seed_3 + (seed_3 << 3) | 0;
    seed_3 = (seed_3 << 21 | seed_3 >>> 11);
    seed_4 = seed_4 + 1 | 0;
    cast32 = cast32 + seed_4 | 0;
    seed_3 = seed_3 + cast32 | 0;
    return (cast32 >>> 0) / 4294967296;
  }
}
