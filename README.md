# Swatch

Takes an obj containing a title and an array of RGB values and produces

1. an Adobe swatch file formatted buffer, or
2. an array of swatch RGB values

## Examples

where *size* is *12*, the size of the palette
and *obj* is

```javascript
{
  title: 'Example',
  data: [[100,200,100],[30,12,19]]...[255,100,0]]
}
```

### A binary buffer in Adobe ASE format.

```javascript
swatch(obj, size, function(buffer) {
  fs.writeFile(obj.title + '.ase', buffer)
})
```

### An array of swatch RGB values

```javascript
swatch.justData(obj, size, function(array) {
  console.log(array);
})
```

## License
swatch.js &copy; 2012 Andy Willis  
Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php