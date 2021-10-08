import Parser from "../Parser.js";
import {Load as Fuel, NoEffect} from "../Response.js";

const Load = {

	cost(action, game, player) {
		return 0;
	},

	fcost(action, game, player) {
		return 0;
	},

	legal(action, game, player) {
		const cell = game.map.cells[player.position.y][player.position.x];
		return player.fuel < game.conf.USER_MAXFUEL;
	},

	process(action, game, player) {
		const load = Math.min(1, game.map.cells[player.position.y][player.position.x].content.fuel);
		game.map.cells[player.position.y][player.position.x].content.fuel -= load;
		player.fuel += load;
		return [load ? Fuel : NoEffect];
	},

	serialize(action) {
		return "load";
	},

	parse: Parser.action(x => ({}), Parser.seq([
		Parser.alt([
			Parser.string("load"),
			Parser.string("l"),
		]),
		Parser.end,
	])),

};
export default Load;
