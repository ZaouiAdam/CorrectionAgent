import Game from "./Game.js";
import Parser from "./Parser.js";
import Load from "./actions/Load.js";
import Move from "./actions/Move.js";
import {Dead, Illegal, NoGold, NoFuel, NoEffect} from "./Response.js";

export const Actions = [Load, Move];
const getParser = type => Parser.action(data => ({type, data}), type.parse);

const Action = {

	parse: Parser.alt(Actions.map(getParser)),

	run(action, game, player) {

		if ( !player.alive )
			return [Dead];

		var cost = action.type.cost(action.data, game, player);
		var fcost = action.type.fcost(action.data, game, player);
		var responses, hasChanged = false;

		if ( !action.type.legal(action.data, game, player) ) {
			hasChanged = player.gold > 0;
			player.gold -= Math.min(1, player.gold);
			responses = [Illegal];
		} else if ( cost > player.gold )
			responses = [NoGold];
		else if ( fcost > player.fuel )
			responses = [NoFuel];
		else {
			player.gold -= cost;
			player.fuel -= fcost;
			responses = action.type.process(action.data, game, player);
			hasChanged = responses.length == 1 && responses[0] != NoEffect;
		}
		if ( player.gold < 1 ) {
			hasChanged = true;
			player.alive = 0;
			responses.push(Dead);
		}

		if ( hasChanged )
			game.notify(action);

		return responses;
	}

};
export default Action;
