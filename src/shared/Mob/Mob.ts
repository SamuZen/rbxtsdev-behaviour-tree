import { BehaviourTree } from "@rbxts/behaviour-tree";
import { RobotsDB } from "_database/game/robots/data";
import { RobotId } from "_database/game/robots/ids";

export class Mob {
	private behaviourTree: BehaviourTree;

	constructor(handle: BasePart, spawn: BasePart, robotId: RobotId) {
		const robotData = RobotsDB.robots[robotId];
		this.behaviourTree = robotData.behaviour(handle, spawn);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
