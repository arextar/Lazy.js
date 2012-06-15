# Lazy.js
A simple and useful resource loader for JavaScript. It supports loading CSS and JavaScript out of the box, but it has XMLHttpRequest capabilities and is easily extendable, allowing the addition of other resource loaders such as images and CoffeeScript.

# How to use
## lazy(resources... [, options] [, callback])

* resources- A string representation of a resource (ex: `style.css`, `script.js`) or an array of such strings
* options- An object containing options including the following:
  * force- Force Lazy.js to treat the file as a certain type (ex: `js`, `xhr`). Defaults to undefined.
  * parallel- Describes how Lazy.js should load an array of resources. If true, Lazy.js loads them at the same time. If false, it loads them in succession (good for javascript files dependant on each other)
* callback- A function passed that is called when all the resources are loaded following the convention of function(error, result) where result will be an array if an array is passed to resources