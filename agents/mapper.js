import net		from "net";

function showMap(data) {
	var str = "";
	var x = 0, y = 0;
	for (var l of data.map) {
		for(var c of l) {
			if ( data.position.x == x && data.position.y == y )
				str += "X";
			else str += c || "?";
			x += 1;
		}
		y += 1;
		x = 0;
		str += "\n"
	}
	console.log(str);
}

function move(position, dir) {
	const deltas = {'move west': {x: -1, y: 0}, 'move east': {x: 1, y: 0}, 'move south': {x: 0, y: 1}, 'move north': {x: 0, y: -1}};
	return {x: position.x + deltas[dir].x, y: position.y + deltas[dir].y};
}


function updateMap({position, size, map}, direction, context) {

	var newPosition = move(position, direction);
	var minPos = {x: newPosition.x - 1, y: newPosition.y - 1};
	var maxPos = {x: newPosition.x + 1, y: newPosition.y + 1};

	if (minPos.x < 0) {
		for(var i = 0; i < map.length; i++)
			map[i].unshift(undefined);
		newPosition.x += 1;
		size.x += 1;
	}

	if (minPos.y < 0) {
		map.unshift(new Array(size.x));
		newPosition.y += 1;
		size.y += 1;
	}

	if (maxPos.x >= size.x) {
		for(var i = 0; i < map.length; i++)
			map[i].push(undefined);
		size.x += 1;
	}

	if (maxPos.y >= size.y) {
		map.push(new Array(size.x));
		size.y += 1;
	}

	for(var i = -1; i <= 1; i++)
		for(var j = -1; j <= 1; j++)
			map[newPosition.y + i][newPosition.x + j] = context[i + 1][j + 1];

	return {position: newPosition, size, map};

}


function showContext(ctx) {
	var str = "=====\n=";
	for(var l of ctx) {
		for(var c of l)
			switch (c.type) {
				case "wall": str += "#"; break;
				case "start": str += "S"; break;
				case "cell": str += " "; break;
			}
		str += "=\n=";
	}
	str += "====";
	console.log(str);
}


var map = [
	['.', '.', '.'],
	['.', '.', '.'],
	['.', '.', '.'],
];



//~ var ctx = [
	//~ ['.', '.', '#'],
	//~ ['.', '.', '#'],
	//~ ['.', '.', '#'],
//~ ];

//~ var newMap = {position: {x: 1, y: 1}, size: {x: 3, y: 3}, map};
//~ newMap = updateMap(newMap, 'move east', ctx);
//~ newMap = updateMap(newMap, 'move south', ctx);
//~ newMap = updateMap(newMap, 'move south', ctx);
//~ newMap = updateMap(newMap, 'move south', ctx);
//~ newMap = updateMap(newMap, 'move south', ctx);
//~ newMap = updateMap(newMap, 'move south', ctx);
//~ newMap = updateMap(newMap, 'move east', ctx);
//~ newMap = updateMap(newMap, 'move east', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);
//~ newMap = updateMap(newMap, 'move west', ctx);
//~ newMap = updateMap(newMap, 'move west', ctx);
//~ newMap = updateMap(newMap, 'move west', ctx);
//~ newMap = updateMap(newMap, 'move west', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);
//~ newMap = updateMap(newMap, 'move north', ctx);

//~ showMap(newMap);



var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');






function parseMessage(msg) {
	var idx = msg.indexOf(" ");
	switch(idx != -1 ? msg.substr(0, idx) : msg) {
		case 'state': return {type: "state", data: JSON.parse(msg.substr(idx + 1))};
		case 'context': return {type: "context", data: JSON.parse(msg.substr(idx + 1))};
		default: return {type: "welcome"};
	}
}



var port		= 62342;
var host		= "localhost";
var socket 		= net.createConnection(port, host, function() {
	console.log("listening");

});

socket.on("data", handle);
function sendMessage(m) {
	lastDir = m;
	console.log(new Date, "sending message : ", m);
	socket.write(m);
	socket.write("\n");
}

function translateContext(ctx) {
	return ctx.map(l => l.map(c => c.type === 'wall' ? '#' : '.'));
}


var context;
var newMap = {position: {x: 1, y: 1}, size: {x: 3, y: 3}, map: null};
var lastDir = null;

function notify(messages) {
	var msgs = messages.map(parseMessage);

	for(var i = 0; i < msgs.length; i++)
		if ( msgs[i].type == "context" ) {
			context = msgs[i].data;
			msgs.splice(i, 1);
			i--;
		}
	if ( !context ) return sendMessage('context');


	if (!newMap.map) {
		newMap.map = translateContext(context);
		showMap(newMap);
		return;
	}

	if ( msgs.length )
		return;
	newMap = updateMap(newMap, lastDir, translateContext(context));
	showMap(newMap);

	//~ console.log(new Date, "receiving message : ");
	//~ showContext(context);

}

var buffer = "";
function handle(data) {
	//~ console.log("<from server>: " + data.toString().trim());
	var b = data.toString();

	if ( b[b.length - 1] != "\n" )
		buffer += b;

	else {
		notify((buffer + b).split("\n").map(x => x.trim()).filter(x => x.length));
		buffer = "";
	}

}



stdin.on('data', function(key){
    if (key == '\u001B\u005B\u0041') {
        sendMessage('move north');
    }
    if (key == '\u001B\u005B\u0043') {
        sendMessage('move east');
    }
    if (key == '\u001B\u005B\u0042') {
        sendMessage('move south');
    }
    if (key == '\u001B\u005B\u0044') {
        sendMessage('move west');
    }

    if (key == '\u0003') { process.exit(); }    // ctrl-c
});




















