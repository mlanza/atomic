var stooges = ["Larry","Curly","Moe"],
    pieces  = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity},
    court   = {jack: 11, queen: 12, king: 13},
    worth   = {pieces: pieces, court: court};

QUnit.test("sequences", function(assert){
  assert.deepEqual(_.toArray(_.take(5, _.cycle(["A","B","C"]))), ["A","B","C","A","B"])
  assert.deepEqual(_.toArray(_.take(5, _.integers())), [1,2,3,4,5]);
  assert.deepEqual(_.toArray(_.interleave(["A","B","C","D","E"], _.repeat("="), _.integers())), ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]);
  assert.deepEqual(_.toArray(_.interleave([1,2,3],[10,11,12])), [1,10,2,11,3,12]);
  assert.deepEqual(_.toArray(_.rest(["A","B","C"])), ["B", "C"]);
  assert.deepEqual(_.toArray(_.repeatedly(3, _.constantly(4))), [4,4,4]);
  assert.deepEqual(_.toArray(_.concat(stooges, ["Shemp","Corey"])), ["Larry","Curly","Moe","Shemp","Corey"]);
  assert.equal(_.second(stooges), "Curly");
  assert.deepEqual(_.toArray(_.range(4)), [0,1,2,3]);
  assert.equal(_.some(_.isEven, [1,2,3]), true);
  assert.equal(_.notAny(_.isEven, [1,2,3]), false);
  assert.equal(_.every(_.isEven, [2,4,6]), true);
  assert.equal(_.maxKey(function(obj){
    return obj["king"];
  }, pieces, court), pieces);
  assert.deepEqual(_.toArray(_.dropLast(3, [9,8,7,6,5,4,3])), [9,8,7,6]);
  assert.deepEqual(_.selectKeys(pieces, ["pawn", "knight"]), {pawn: 1, knight: 3});
  assert.deepEqual(_.everyPred(_.isEven, function(x){
    return x > 10;
  })(12,14,16), true);
  assert.deepEqual(_.toArray(_.flatten(["A","B",["C","D"],["E", ["F", "G"]]])), ["A","B","C","D","E","F","G"]);
  assert.deepEqual(_.sort(stooges), ["Curly","Larry","Moe"]);
});

QUnit.test("ilookup", function(assert){
  assert.equal(_.get(stooges, 2), "Moe");
  assert.equal(_.get(pieces, "pawn"), 1);
  assert.equal(_.getIn(worth, ["pieces", "queen"]), 10);
});

QUnit.test("iassociative", function(assert){
  assert.deepEqual(_.assoc(stooges, 0, "Shemp"), ["Shemp","Curly","Moe"]);
  assert.deepEqual(_.assoc(court, "ace", 14), {jack: 11, queen: 12, king: 13, ace: 14});
  assert.deepEqual(_.assocIn(worth, ["court","ace"], 1), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {ace: 1, jack: 11, queen: 12, king: 13}});
  assert.deepEqual(_.assocIn(worth, ["court","king"], Infinity), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: Infinity}});
  assert.deepEqual(_.update(court, "jack", _.partial(_.add, -10)), {jack: 1, queen: 12, king: 13});
  assert.deepEqual(_.updateIn(worth, ["court","king"], _.partial(_.add, -10)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: 3}});
  assert.deepEqual(stooges, ["Larry","Curly","Moe"], "no mutations occurred");
  assert.deepEqual(court, {jack: 11, queen: 12, king: 13}, "no mutations occurred");
});

QUnit.test("comparisons", function(assert){
  assert.equal(_.eq(1, 1, 1), true);
  assert.equal(_.eq(1, "1", 1.0), false);
  assert.equal(_.equal(1, "1", 1.0), true);
  assert.equal(_.lt(1, 2, 3, 4), true);
  assert.equal(_.lt(1, 6, 2, 3), false);
  assert.equal(_.lte(1, 1, 2, 3, 3, 3), true);
  assert.equal(_.notEq(1, 1, 2, 2, 3, 3), true);
  assert.equal(_.notEq(3, 3, 3), false);
});

QUnit.test("transduce", function(assert){
  assert.deepEqual(_.into([], _.comp(_.take(4), _.map(_.inc)), _.cycle([1,2,3])), [2,3,4,2]);
});

QUnit.test("record", function(assert){
  const Person = _.record("name", "surname", "dob");
  const sean   = new Person("Sean", "Penn", new Date(1960, 7, 17));
  const robin  = Person.create("Robin", "Wright", new Date(1966, 3, 8));
  const dylan  = Person.from({name: "Dylan", surname: "Penn", dob: new Date(1991, 3, 13)});
  assert.equal(_.get(robin, "surname"), "Wright");
  assert.equal(_.get(_.assoc(robin, "surname", "Penn"), "surname"), "Penn");
  assert.equal(_.get(sean, "surname"), "Penn");
  assert.equal(_.count(robin), 3);
});