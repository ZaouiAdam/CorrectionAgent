import SocketAgent from "./SocketAgent.js";


function parseMessage(msg) {
	var idx = msg.indexOf(" ");
	switch(idx != -1 ? msg.substr(0, idx) : msg) {
		case 'state': return {type: "state", data: JSON.parse(msg.substr(idx + 1))};
		case 'context': return {type: "context", data: JSON.parse(msg.substr(idx + 1))};
		default: return {type: "welcome"};
	}
}


export default SocketAgent(function() {

	//~ var map = [];

	// fonction qui contient la logique de l'agent
	return function (sendMessage, messages) {
		//debut de l'agent

		console.log(new Date, "NEW MESSAGES");
		console.log(new Date, messages);
		console.log(new Date, messages.map(parseMessage));
		console.log("############################################");
		console.log("\n\n\n\n");


		//~ sendMessage("context");

		// fin de l'agent
	};
});
