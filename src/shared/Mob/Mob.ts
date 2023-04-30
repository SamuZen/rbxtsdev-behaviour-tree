import { BehaviourTree } from "@rbxts/behaviour-tree";
import { RobotsDB } from "_database/game/robots/data";
import { RobotId } from "_database/game/robots/ids";

export class Mob {
	private behaviourTree: BehaviourTree;

	constructor(handle: BasePart, spawn: BasePart, robotId: RobotId, behaviourLevel: number) {
		this.behaviourTree = RobotsDB.robots[robotId].behaviours[behaviourLevel](handle, spawn);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
