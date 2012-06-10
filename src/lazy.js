;(function () {
  window.lazy = function lazy (resource, options, callback) {
    var i, v, ext, batch
    if ('function' === type(options)) {
      callback = options
      options = {}
    }
    
    if ('object' === type(resource)) {
      for(i in resource){
        lazy(i, options, resource[i])
      }
    }
    else if ('array' === type(resource)) {
      
      if (options.parallel === false){
        var l = 0, res = [null]
        
        ;(function next (err, dat) {
          if(err) return callback(err)
          if(l) res[l] = dat
          
          
          var v
          if (v = resource[l++]) {
            lazy(v, options, next)
          }
          else {
            callback.apply(null, res)
          }
        })()
        
      }
      else {
        var l = 0, res = [null], stop = 0
        
        function done(ind){
          return function(err, dat){
            if (!stop) {
              if (err) {
                callback(err)
                stop = 1
              }
              else {
                res[ind] = dat
                
                if (++l === i) {
                  callback.apply(null, res)
                  res = callback = null
                }
              }
            }
          }
        }
        
        for(i = 0; v = resource[i++];) lazy(v, options, done(i))
        i--
      }
    }
    else {
      // Have seperate batches for forced XHRs to allow for custom transports
      var force = options.force, id = resource + (force ? "-force" + force : "")
      if (batches.hasOwnProperty(id)) {
        batches[id].push(callback)
      }
      else {
        batch = batches[id] = [callback]
        ext = /\.(\w+)$/.exec(resource)[1]
        
        try{
          ;(transports[force ? force === 'xhr' ? '_' : force : ext] || transports._)(resource, function(){
            for (var i = 0, fn; fn = batch[i++]; ) fn.apply(this, arguments)
          })
        }
        catch(e){
          for (var i = 0, fn; fn = batch[i++]; ) fn(e)
        }
      }
      
      
    }
  }
  
  var transports = lazy.transports = {
    _: function(src, callback){
      // TODO: Error handling here
      var xhr = 'XMLHttpRequest' in window ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP.3.0')
      
      xhr.open('GET', src, true)
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          callback(null, xhr.responseText)
          xhr.onreadystatechange = null
          xhr = null
        }
      }
      
      xhr.send()
    },
    
    js: function(src, callback){
      var script
      function ready () {
        if (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete') {
          callback(null, null)
          toss(script)
          script = null
        }
      }
      
      head.appendChild(
        script = create('script', {src: src, onload: ready, onreadystatechange: ready})
      )
    },
    
    css: function (src, callback) {
      var link, done
      function ready () {
        if (!done) {
          done = 1
          
          callback(null, null)
        }
      }
      
      setTimeout(function check () {
        if (!done) {
          if (link.sheet){
            for (var i = 0, s, owner; s = sheets[i++]; ) {
              if ((s.ownerNode || s.owningElement) === link) ready()
            }
          }
          
          setTimeout(check, 16)
        }
      }, 16)
      
      head.appendChild(
        link = create('link', {rel: 'stylesheet', href: src, onload: ready})
      )
      
    }
  },
  batches = {},
  head = document.getElementsByTagName('script')[0],
  garbage = create('div'),
  sheets = document.styleSheets
  
  function create(tag, attrs) {
    var elem = document.createElement(tag), x
    
    if (attrs) for (x in attrs) elem[x] = attrs[x]
    
    return elem
  }
  
  function toss (elem) {
    garbage.appendChild(elem)
    garbage.innerHTML = ''
  }
  
  function type (obj) {
    var t = typeof obj
    return t === 'object' ? {}.toString.call(obj).slice(8, -1).toLowerCase() : t
  }
})();