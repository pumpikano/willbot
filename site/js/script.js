


function VisualElement(paths) {
	this.paths = paths.map(function (path) {
		var p = new SVGPathData(path);
		// p.toRel();
		p.toAbs();
		return p;
	});
}

VisualElement.prototype.createElements = function (attrs) {
	return this.paths.map(function (path) {
		var pathEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
		pathEl.setAttribute('d', path.encode());

		for (attr in attrs) {
			pathEl.setAttribute(attr, attrs[attr]);
		}

		return pathEl;
	});
};

VisualElement.prototype.drawOnto = function (elem, attrs) {
	attrs = attrs || {};
	this.createElements(attrs).forEach(function (path) {
		elem.appendChild(path);
	});
};

VisualElement.prototype.getBounds = function () {
	var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

	this.paths.forEach(function (p) {
		p.commands.forEach(function (cmd) {
			if (!cmd.relative) {
				for (key in cmd) {
					if (/^x.?/.test(key)) {
						minX = Math.min(minX, cmd[key]);
						maxX = Math.max(maxX, cmd[key]);
					} else if (/^y.?/.test(key)) {
						minY = Math.min(minY, cmd[key]);
						maxY = Math.max(maxY, cmd[key]);
					}
				}
			}
		});
	});

	return [minX, maxX, minY, maxY];
};

VisualElement.prototype.setTopLeft = function (x, y) {

	var bounds = this.getBounds();

	this.paths.forEach(function (p) {
		p.commands.forEach(function (cmd) {
			if (!cmd.relative) {
				for (key in cmd) {
					if (/^x.?/.test(key)) {
						cmd[key] = cmd[key] - bounds[0] + x;
					} else if (/^y.?/.test(key)) {
						cmd[key] = cmd[key] - bounds[2] + y;
					}
				}
			}
		});
	});

};

VisualElement.prototype.scale = function (scale) {
	this.paths.forEach(function (path) {
		path.commands.forEach(function (cmd) {
			for (key in cmd) {
				if (/^x.?/.test(key) || /^y.?/.test(key)) {
					cmd[key] = cmd[key] * scale;
				}
			}
		});
	});
}






var svg = document.getElementById('svg-canvas');




// // var v = new VisualElement(elementsPaths['circle layers']);
// var v = new VisualElement(elementsPaths['simple wang']);

// v.setTopLeft(0, 0);
// v.scale(1.5);

// v.drawOnto(svg, {
// 	'fill': 'none',
// 	'stroke': '#000000',
// 	'stroke-width': '2',
// 	'stroke-miterlimit': '10'
// });









function genDrawing(n) {
	var elementTypes = Object.keys(elementsPaths);

	for (var i = 0; i < n; i++) {
		var name = elementTypes[Math.random() * elementTypes.length >> 0];

		var v = new VisualElement(elementsPaths[name]);
		v.setTopLeft(Math.random() * 400, Math.random() * 400);
		v.scale(Math.random());
		v.drawOnto(svg, {
			'fill': 'none',
			'stroke': '#000000',
			'stroke-width': '2',
			'stroke-miterlimit': '10'
		});
	}
}
















