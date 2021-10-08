
const Player = {

	write: function(player, write) {
		write("###############\n");
		write(`# ${player.id}\n`);
		write(`# ${player.alive ? "ALIVE" : "DEAD"}\n`);
		write(`# position: ${JSON.stringify(player.position)}\n`);
		write(`# gold: ${player.gold}\n`);
		write(`# fuel: ${player.fuel}\n`);
		write("###############\n");
	},

};

export default Player;
