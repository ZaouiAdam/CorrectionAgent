
var ready = Promise.resolve();

function delay(timeout) {
	return ready = ready.then(() => new Promise((r,j) => setTimeout(r, timeout)));
}

export default function RandomAgent(sendMessage, messages) {
	console.log(messages);
	console.log("looping !!!!!");
	const moves = ['mv n', 'mv e', 'mv w', 'mv s', 'load'];
	const mv = moves[Math.floor(Math.random() * moves.length)];
	console.log("sending to server : ", mv);
	delay(300).then(() => {
		console.log("sending to server : ", mv);
		sendMessage(mv)
	});
}
