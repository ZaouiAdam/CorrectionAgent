import {Wall, Fuel, Gold, Flag, Portal, Space, Start, Omega, Trap} from "./Map.js";

function convert(cell) {
	switch(cell) {
		case '~':
		case '=':
		case '%':
		case '@': return Portal(cell);
		case '_':
		case '|': return Door();
		case ' ': return Space();
		case '*': return Start();
		case '&': return Flag(Math.random());
		case '+': return Fuel();
		case '$': return Gold();
		case '!': return Trap();
		case 'Ω': return Omega();
		default: return Wall(cell);
	}
}

export default function SimpleReader(mapString) {

	var lines = mapString.trim().split("\n").filter(l => l.length);
	var map = {portals: {}, starts: [], magics: [], cells: []};
	var lineLength = 0;
	var cell, row, comment;

	var i = 0;
	for(var line of lines) {
		row = [];
		map.cells.push(row);
		comment = line[0] == '/';
		if (!comment && lineLength && lineLength != line.length)
			throw new Error("Invalid map : lines of different length : " + (i + 1));
		for(var j = 0; j < line.length; j++) {
			cell = convert(line[j]);
			row.push(cell);
			if (!comment) switch (cell.type) {
				case 'portal':
					if ( !map.portals[cell.id] )
						map.portals[cell.id] = [];
					map.portals[cell.id].push({cell, position: {x: j, y: i}});
				break;

				case 'start':
					map.starts.push({cell, position: {x: j, y: i}});
				break;

				case 'gold':
				case 'fuel':
					map.magics.push({cell, position: {x: j, y: i}});

			}
		}
		i++;
	}
	if ( !map.starts.length )
		throw new Error("Invalid map : no start point !");
	return map;
}
