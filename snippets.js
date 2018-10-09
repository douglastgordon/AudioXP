// returns 1
function a(x) {
  var x = 1
  return x
}
a(2)

// Syntax error
function a(x) {
  let x = 1
  return x
}
a(2)

// syntax error
function a(x) {
  const x = 1
  return x
}
a(2)

// returns 2
function a(x) {
  return x
  var x = 1
}
a(2)


// 1 3
function foo(str, a) {
	eval( str )
	console.log( a, b )
}
var b = 2;
foo( "var b = 3;", 1 )

// 1 3
function foo(str, a) {
  console.log(eval)
  console.log(globalEval)
	globalEval( str )
	console.log( a, b )
}
var b = 2;
var globalEval = eval.bind(this)
foo( "var b = 3;", 1 )



const x = [1,2,3]
function foo(y) {
  y[0] = 4
}
foo(x)
console.log(x) // [4,2,3]



function foo() {
  if (true) {
    function bar() {
      console.log("I'm bar")
    }
  }
  bar()
}
foo() // logs I'm bar



function foo() {
	var a = 2;

	function bar() {
		console.log( a );
	}

	return bar;
}

var baz = foo();
foo = null
baz(); // 2 -- Whoa, closure was just observed, man.


const object = {
  id: 1,
  logId: () => console.log(this.id)
}
object.logId()

const object = {
  id: 1,
  logId: function(){ console.log(this.id)}
}
object.logId()
