import SocketAgent from "./SocketAgent.js";


const deltas = {'move west': {x: -1, y: 0}, 'move east': {x: 1, y: 0}, 'move south': {x: 0, y: 1}, 'move north': {x: 0, y: -1}};
function move(context, dir) {
	return context[deltas[dir].y + 1][deltas[dir].x + 1];
}


function filter(context, state, mv) {
	switch(mv) {
		case 'move north': return move(context, mv).type != "wall";
		case 'move south': return move(context, mv).type != "wall";
		case 'move east': return move(context, mv).type != "wall";
		case 'move west': return move(context, mv).type != "wall";
		//~ case 'fill': return context[1][1].type == "fuel";
	}
}


function parseMessage(msg) {
	var idx = msg.indexOf(" ");
	switch(idx != -1 ? msg.substr(0, idx) : msg) {
		case 'state': return {type: "state", data: JSON.parse(msg.substr(idx + 1))};
		case 'context': return {type: "context", data: JSON.parse(msg.substr(idx + 1))};
		default: return {type: "welcome"};
	}
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


function comp(dir) {
	switch(dir) {
		case "north": return "south";
		case "south": return "north";
		case "east": return "west";
		case "west": return "east";
	}
}

ABC
DEF
GHI

map = []

function updateCell(here, dir, data) {
	if (here[dir])
		return;
	here[dir] = {
		type: data.type,
		north: null,
		south: null,
		east: null,
		west: null,
	}
	here[dir][comp(dir)] = here;
}

function buildMap(here, ctx) {
	updateCell(here, "north", ctx[0][1]);


	updateCell(here, "south", ctx[2][1]);
	updateCell(here, "east", ctx[1][2]);
	updateCell(here, "west", ctx[1][0]);
}

export default SocketAgent(function() {

	var ready = Promise.resolve();
	var context = null;
	var state = null;
	var lastAction = 'move north';
	var map = {
		type: "start",
		north: null,
		south: null,
		east: null,
		west: null,
	};

	var map2 = [["S"]]

	function delay(timeout) {
		return ready = ready.then(() => new Promise((r,j) => setTimeout(r, timeout)));
	}

	return (sendMessage, messages) => {
		var msgs = messages.map(parseMessage);
		//~ console.log(new Date, messages);
		//~ console.log(msgs);


		for(var i = 0; i < msgs.length; i++)
			if ( msgs[i].type == "context" ) {
				context = msgs[i].data;
				msgs.splice(i, 1);
				i--;
			}
		for(var i = 0; i < msgs.length; i++)
			if ( msgs[i].type == "state" ) {
				state = msgs[i].data;
				msgs.splice(i, 1);
				i--;
			}

		//~ if ( !state ) return sendMessage('state');
		if ( !context ) return sendMessage('context');
		if (context) showContext(context);

		//~ if ( msgs.length ) {
			//~ console.log("Still messages !!!!");
			//~ console.log({context, state}, msgs);
			//~ console.log(messages);
			//~ messages.lol();
		//~ }
		//~ console.log(messages);
		//~ console.log("looping !!!!!");
		const moves = [lastAction].concat(['move north', 'move east', 'move south', 'move west']).filter(move => filter(context, state, move));
		//~ console.log("sending to server : ", mv);
		if (moves.length) delay(300).then(() => {
			const mv = moves[0];
			lastAction = mv;
			//~ const mv = moves[Math.floor(Math.random() * moves.length)];
			//~ console.log("sending to server : ", mv);
			sendMessage(mv)
		});
	};

});
