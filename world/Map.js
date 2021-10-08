/*****************************************/
/* external
/*****************************************/
function gaussian() { // -_-
	return (Math.random() + Math.random()) / 2;
}

/*****************************************/
/*
/*****************************************/

function convert (cell) {
	switch(cell.type) {
		case 'space': return ' ';
		case 'flag': return '&';
		case 'door': return cell.open ? '_' : '|';
		case 'fuel': return cell.content.fuel ? '+' : '-';
		case 'gold': return '$';
		case 'start': return '*';
		case 'omega': return 'Ω';
		case 'trap': return '!';
		case 'portal': return cell.id;
		case 'wall': return cell.chr;
		default: throw new Error("Unknown cell type !");
	}
}

const Map = {

	write: function (mapObject, write) {
		var cell;
		for(var i = 0; i < mapObject.cells.length; i++) {
			for(var j = 0; j < mapObject.cells[i].length; j++) {
				cell = mapObject.cells[i][j];
				if (cell.content && cell.content.players.length == 1)
					write(cell.content.players[0].id.substr(0, 1));
				else if (cell.content && cell.content.players.length > 1)
					write(`${cell.content.players.length}`);
				else write(convert(cell));
			}
			write("\n");
		}
	},

	refresh: function (map) {
		for(var magic of map.magicsAll)
			switch(magic.type) {
				case 'Gold': magic.content.gold += magic.rate * 10 + Math.random() * 10;
			}
	},

};
export default Map;

/*****************************************/
/* Data constructors for cells
/*****************************************/
function CellContent(fuel = 0, gold = 0) {
	return {fuel, gold, tokens: [], players: []};
}

export function Wall(chr) {
	return {type: "wall", chr};
}

export function Trap() {
	return {type: "trap", content: CellContent()};
}

export function Door(open) {
	return {type: "door", open};
}

export function Space(content = CellContent()) {
	return {type: "space", content};
}

export function Start(content = CellContent()) {
	return {type: "start", content};
}

export function Flag(id, content = CellContent()) {
	return {type: "flag", id, content};
}

export function Omega(content = CellContent()) {
	return {type: "omega", content};
}

export function Portal(id, content = CellContent()) {
	return {type: "portal", id, content};
}

export function Gold(rate = gaussian(), content = CellContent(0, Math.floor(rate))) {
	return {type: "gold", rate, content};
}

export function Fuel(rate = gaussian(), content = CellContent(Math.floor(rate))) {
	return {type: "fuel", rate, content};
}
