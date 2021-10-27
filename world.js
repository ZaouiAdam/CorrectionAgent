import fs		from "fs";
import Game		from "./world/Game.js";
import SimpleMap	from "./world/spaces/SimpleMap.js";
import SocketServer	from "./world/libs/Server.Socket.js";
//~ import WSServer		from "./world/libs/Server.WebSocket.js";


var mapFile		= '/app/maps/Hello.txt';
var conf		= {port: 62342, host: "0.0.0.0"};
var gameConfiguration	= {
				USER_MAXFUEL:	1000000,
				USER_STARTGOLD:	1000000,
				USER_STARTFUEL:	1000000,
			};





const space		= SimpleMap.read(fs.readFileSync(mapFile, 'utf8'));
const servers		= {socket: SocketServer, /*ws: WSServer*/};
const game		= Game(space, gameConfiguration);
const server		= servers.socket(game, conf).ref();
//~ const wserver		= servers.ws(game, {...conf, port: conf.port + 1});

