function init() {
    var arr = [ 1, 2, 3 ];

    return function tick() {
        console.log( '*', this, arr );
    }
}
var fn = init();
// run from other scope
fn();
fn.call({ test: true });
fn.call( document );