import Parser from "../Parser.js";
import {Cell} from "../Response.js";

const values = {'w': {x: -1, y: 0}, 'e': {x: 1, y: 0}, 'n': {x: 0, y: -1}, 's': {x: 0, y: 1}};
const Move = {

	cost(action, game, player) {
		return 0;
	},

	fcost(action, game, player) {
		return 1;
	},

	legal(action, game, player) {
		return player.fuel > 0 && game.map.cells[player.position.y + values[action].y][player.position.x + values[action].x].type != "wall";
	},

	process(action, game, player) {
		var oplayers = game.map.cells[player.position.y][player.position.x].content.players;
		oplayers.splice(oplayers.indexOf(player), 1);
		player.position.x += values[action].x;
		player.position.y += values[action].y;
		game.map.cells[player.position.y][player.position.x].content.players.push(player);
		return [Cell(player.position)];
	},

	serialize(action) {
		return `move ${action}`;
	},

	parse: Parser.action(
		x => x[2],
		Parser.seq([
			Parser.alt([
				Parser.string("mv"),
				Parser.string("move"),
			]),
			Parser.space,
			Parser.alt([
				Parser.string("w"),
				Parser.string("n"),
				Parser.string("e"),
				Parser.string("s"),
			]),
			Parser.end,
		])
	),

};
export default Move;
