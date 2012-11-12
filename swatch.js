/* 
 * swatch.js Copyright 2012 Andy Willis
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * ASE format information from http://www.selapa.net/swatches/colors/fileformats.php#adobe_ase
 */

exports = module.exports = getBin;
exports.justData = getSwatchData;

function getBin(obj, size, callback) {
	getSwatchData(obj, size, function(swatchData) {
			createSwatchBuffer(swatchData, function(buffer) {
				callback(buffer)
			})
	})
}

function getSwatchData(obj, size, callback) {
	var swatchData = {}
		,	size = size || 12
		,	data = obj.data
		, us = require('underscore')
		,	MMCQ = require('./quantize').MMCQ
		,	cmap = MMCQ.quantize(data, size)
		,	newPalette = cmap.palette()
		;
	
	swatchData.title = obj.title
	swatchData.data = us.uniq(data.map(function(p) { return cmap.map(p) }))
	callback(swatchData)
}

function createSwatchBuffer(obj, callback) {

	var out = []
		,	data = obj.data
		, swatchTitle = obj.title
		,	numberOfBlocks = data.length + 1 // + start block and end block
		;

	out.push({val: 'ASEF', type: 'char', size: 4})
	out.push({val: 1, type: '16', size: 2})
	out.push({val: 0, type: '16', size: 2})
	out.push({val: numberOfBlocks, type: '32', size: 4})
	out.push({val: 'c0', type: 'hex', size: 1})
	out.push({val: '01', type: 'hex', size: 1})
	out.push({val: swatchTitle.length*2+2, type: '32', size: 4})
	out.push({val: swatchTitle.length, type: '16', size: 2})
	out.push({val: swatchTitle, type: 'doub', size: swatchTitle.length*2})

	for (sw in data) {
		var s = data[sw]
			,	webColor = '##{cStr} '
			,	cStr = ''
			, sStrL = 8
			, blLen = 36
			;

		for (c in s) {
			var col = s[c].toString(16);
			cStr += (col.length === 1) ? '0' + col : col
		}

		sStr = webColor.replace('#{cStr}', cStr).toUpperCase()
		out.push({val: 1, type: '16', size: 2})
		out.push({val: blLen, type: '32', size: 4})
		out.push({val: sStrL, type: '16', size: 2})
		out.push({val: sStr, type: 'doub', size: sStrL*2})
		out.push({val: 'RGB ', type: 'char', size: 4})
		out.push({val: s[0]/255, type: 'p32', size: 4})
		out.push({val: s[1]/255, type: 'p32', size: 4})
		out.push({val: s[2]/255, type: 'p32', size: 4})
		out.push({val: 2, type: '16', size: 2})
	}

	var bLen = 0;
	for (el in out) {	bLen += out[el].size };
	var b = new Buffer(bLen),	offset = 0;

	for (var obj = 0, len = out.length; obj < len; obj ++) {
		var v = out[obj].val

		switch(out[obj].type) {
			case 'doub':
				for (var el = 0, l = v.length; el < l; el++) {
					b.write('', offset + el*2)
					b.write(v[el], offset + el*2 + 1)
				};
			break;
			case 'char': b.write(v, offset); break;
			case 'hex': b.write(v, offset, 'hex'); break;
			case '16': b.writeUInt16BE(v, offset); break;
			case '32': b.writeUInt32BE(v, offset); break;
			case 'p32': b.writeFloatBE(v, offset); break;

		}

		offset += out[obj].size
	}
	callback(b)
}