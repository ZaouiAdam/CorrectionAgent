import Parser from "./Parser.js";
import {System, Nothing} from "./Response.js";

export default function Monitor(timeout, game, write, running = false) {

	var dead = false;
	var count = 0;

	function loop(index) {
		if (running && count == index) {
			refresh();
			setTimeout(() => loop(index), timeout);
		}
	}

	function start() {
		if ( !running && !dead ) {
			running = true;
			loop(++count);
		}
	}

	function kill() {
		dead = true;
	}

	function stop() {
		running = false;
	}

	function refresh() {
		game.write(write);
	}

	function run(match) {
		switch(match[1]) {
			case "":
			case " state": refresh(); break;
			case " off": stop(); break;
			case " on": start(); break;
			case " -": timeout += 75; break;
			case " +": timeout -= 75; break;
			default: timeout = match[1][1];
		}
		return [System(`MONITOR ${running ? "ON" : "OFF"} : (${timeout}ms)\n`)];
	}

	const parse = Parser.seq([
		Parser.alt([
			Parser.string("monitor"),
			Parser.string("map"),
		]),
		Parser.alt([
			Parser.seq([Parser.string(' '), Parser.nat]),
			Parser.string(" +"),
			Parser.string(" -"),
			Parser.string(" off"),
			Parser.string(" on"),
			Parser.string(" state"),
			Parser.string(""),
		]),
		Parser.end,
	]);

	if ( running )
		start();

	return {start, stop, kill, refresh, parse, run};

}
