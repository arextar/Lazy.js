test("Basic requests", 2, function(){
  stop()
  lazy("resources/test.js", function(){
    lazy("resources/test.css", function(){
      var elem = document.getElementById("elem")
      equal((elem.currentStyle || getComputedStyle(elem, null)).width, "10px", "Load CSS file")
      start()
    })
  })
})

test("Non-parallel loading", 2, function(){
  stop()
  lazy(["resources/test2.js", "resources/test3.js", "resources/test4.js"], function(){
    start()
  })
})