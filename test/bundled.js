QUnit.test("sequences", function(assert){
  var stooges = ["Larry","Curly","Moe"];
  assert.deepEqual(_.toArray(_.take(5, _.integers())), [1,2,3,4,5]);
  //assert.deepEqual(_.toArray(_.interleave(["A","B","C","D","E"], _.repeat("="), _.integers())), ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]);
  assert.deepEqual(_.toArray(_.interleave([1,2,3],[10,11,12])), [1,10,2,11,3,12]);
  assert.deepEqual(_.toArray(_.take(5, _.cycle(["A","B","C"]))), ["A","B","C","A","B"])
  assert.deepEqual(_.toArray(_.rest(["A","B","C"])), ["B", "C"]);
  assert.deepEqual(_.toArray(_.repeatedly(3, _.constantly(4))), [4,4,4]);
  assert.deepEqual(_.toArray(_.concat(stooges, ["Shemp","Corey"])), ["Larry","Curly","Moe","Shemp","Corey"]);
  assert.equal(_.second(stooges), "Curly");
  assert.deepEqual(_.toArray(_.range(4)), [0,1,2,3]);
});