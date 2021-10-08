
export const Bye = {"type": "bye"};
export const Nothing = {"type": "nothing"};
export const Illegal = {"type": "illegal"};
export const NoFuel = {"type": "nofuel"};
export const NoGold = {"type": "nogold"};
export const NoEffect = {"type": "noeffect"};
export const Load = {"type": "load"};
export const Dead = {"type": "dead"};
export const Cell = position => ({...position, "type": "cell"});
export const System = message => ({"type": "system", message});



function getContext(pos, cells) {
	var cell, context = [[], [], []];
	for(var i = -1; i <=  1; i++)
		for(var j = -1; j <= 1; j++) {
			cell = cells[pos.y + i][pos.x + j];
			context[i + 1][j + 1] = Object.assign({}, cell, !cell.content ? {} : {content: {fuel: cell.content.fuel, gold: cell.content.gold, tokens: cell.content.tokens, players: cell.content.players.map(p => p.id)}});
		}
	return context;
}

const Response = {

	serialize: function (response, game) {
		switch (response.type)  {
			case "nothing": return "";
			case "system": return `response system ${response.message}`;
			case "cell":
				var cell = game.map.cells[response.y][response.x];
				return `response cell ${JSON.stringify(getContext(response, game.map.cells))}`;
			default: return `response ${response.type}`;
		}
	},

	write: function(response, write) {
		write("###############\n");
		write(`# ${response.type}\n`);
		write("###############\n");
	},

};
export default Response;
