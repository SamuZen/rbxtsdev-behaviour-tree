import { Action, NodeStatus } from "@rbxts/behaviour-tree";

const Players = game.GetService("Players");

export const ActionFindTarget = (distance: number): Action => {
	return new Action((blackBoard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		for (const player of Players.GetPlayers()) {
			if (player.Character) {
				//calculate distance from handle to player character
				if (handle.Position.sub(player.Character.GetPivot().Position).Magnitude < distance) {
					const part = player.Character.PrimaryPart
					blackBoard.setVariable("target", part);
					return NodeStatus.SUCCESS;
				}
			}
		}
		return NodeStatus.FAILURE;
	});
};
