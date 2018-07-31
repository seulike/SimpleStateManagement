var m = require("../../")

test("autorun passes Reaction as an argument to view function", function() {
  var observable = m.observable
  var autorun = m.autorun
  var test = observable(34);
  autorun(() => {
    console.log(test.get());
  });
  test.set(456);
})