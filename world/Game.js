import Action from "./Action.js";
import Map from "./Map.js";
import Player from "./Player.js";
import {Dead} from "./Response.js";

const defaultConfiguration = {
	USER_STARTGOLD:	1,
	USER_STARTFUEL:	5,
	USER_MAXFUEL:	10,
};

export default function(map, _conf = {}) {
	const conf = Object.assign({}, defaultConfiguration, _conf);
	var players = [];
	var notifiers = [];
	var self = {map, players, notifiers, conf,

		addPlayer(id, gold = conf.USER_STARTGOLD, fuel = conf.USER_STARTFUEL) {
			var pos = self.getRandomStart();
			var player = {id, fuel, gold, alive: true, position: pos};
			players.push(player);
			map.cells[pos.y][pos.x].content.players.push(player);
			return [
				action => self.run(player, action),
				() => self.removePlayer(player),
			];
		},

		removePlayer(player) {
			var idx = players.indexOf(player);
			if (idx != -1) {
				players.splice(idx, 1);
				var cplayers = map.cells[player.position.y][player.position.x].content.players;
				cplayers.splice(cplayers.indexOf(player), 1);
			}
		},

		write(write) {
			Map.write(map, write);
			for(var p of players)
				Player.write(p, write);
			write((new Date()).toString());
			write("\n");
		},

		getRandomStart() {
			return Object.assign({}, map.starts[Math.floor(Math.random() * map.starts.length)].position);
		},

		notify() {
			for(var n of notifiers)
				n(self);
		},

		parse: Action.parse,

		run(player, action) {
			if (!player.alive)
				return [Dead];
			return Action.run(action, self, player);
		},

	};
	return self;
}
