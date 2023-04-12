import { Action, Condition, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";

const Players = game.GetService("Players");

const sequence = new Sequence();

sequence.addChild(
	new Condition((blackBoard: Blackboard) => {
		const maxTargetDistance = blackBoard.getVariable("maxTargetDistance") as number;
		const handle = blackBoard.getVariable("handle") as BasePart;
		for (const player of Players.GetPlayers()) {
			if (player.Character) {
				//calculate distance from handle to player character
				if (handle.Position.sub(player.Character.GetPivot().Position).Magnitude < maxTargetDistance) {
					blackBoard.setVariable("target", player.Character.PrimaryPart);
					return true;
				}
			}
		}
		return false;
	}),
);

export { sequence as findNewTarget };
