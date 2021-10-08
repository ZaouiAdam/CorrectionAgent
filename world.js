import fs		from "fs";
import net		from "net";
import Monitor		from "./world/Monitor.js";
import Parser		from "./world/Parser.js";
import Game		from "./world/Game.js";
import Map		from "./world/Map.js";
import SimpleMap	from "./world/Map.SimpleReader.js";
import Player		from "./world/Player.js";
import Action		from "./world/Action.js";
//~ import StartAgent	from "./Agents/Agent.js";
//~ import RandomAgent	from "./Agents/types/Random.js";
import Response, {Bye} from "./world/Response.js";

var port		= 62342;
var host		= "0.0.0.0";
var playerCount		= 25;
var map			= SimpleMap(fs.readFileSync('/app/maps/Maps.txt', 'utf8'));
var game		= Game(map, {
				USER_MAXFUEL:	1000000,
				USER_STARTGOLD:	1000000,
				USER_STARTFUEL:	100000,
			});

net.createServer(onConnection).listen(port, host);

function bufferize(socket, f) {
	var buffer = "";
	return (data) => {
		var b = data.toString();
		if ( b[b.length - 1] == "\n" ) {
			f((buffer + b).trim());
			buffer = "";
		} else buffer += b;
	};
}

function onConnection(socket) {
	playerCount		= (playerCount + 1) % 26;
	var lastCommand		= "state";
	const playerId		= String.fromCharCode(65 + playerCount);
	const monitor		= Monitor(500, game, d => socket.write(d));
	const [run, remove]	= game.addPlayer(playerId);
	function close() {
		remove();
		monitor.kill();
		socket.destroy();
	}
	function handle(command, recurse = false) {

		Parser.alt([
			Parser.action(
				responses => responses.map(r => [r, Response.serialize(r, game)]).map(response => {
					var bye = 0;
					if (response[1].length) {
						bye = bye || response[0] == Bye;
						socket.write(response[1]);
						socket.write("\n");
					}
					if ( bye ) close();
					lastCommand = command;
				}),
				Parser.alt([
					Parser.action(monitor.run, monitor.parse),
					Parser.action(run, game.parse),
					Parser.action(() => [Bye], Parser.seq([Parser.string("exit"), Parser.end])),
				])
			),
			Parser.action(() => handle(lastCommand, true), Parser.filter(() => !recurse, Parser.end)),
			Parser.action(() => socket.write(`<PROTOCOLERROR> bad command #${command}#\n`), Parser.true)
		])({pos: 0}, command);

	}
	socket.on('data',	bufferize(socket, handle));
	socket.on('end',	close);
	socket.on('close',	close);
	socket.on('error',	close);
	socket.write(playerId + "\n");
}
