var fs = require('fs')
  , swatch = require('./swatch')
  , obj = require('./data')
  , size = 12


swatch.justData(obj, size, function(array) {
  console.log(array);
})

swatch(obj, size, function(buffer) {
  fs.writeFile(obj.title + '.ase', buffer)
})