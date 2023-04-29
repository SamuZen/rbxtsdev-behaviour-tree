import { BehaviourTree, NodeStatus, Selector, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { DasherAgent } from "shared/BehaviourTree/Agents/DasherAgent";
import { ElevatorAgent } from "shared/BehaviourTree/Agents/ElevatorAgent";
import { ActionSetBlackboardVariable } from "shared/BehaviourTree/Features/Blackboard/BlackboardActions";
import {
	CondHasBlackboardVariable,
	CondNoBlackboardVariable,
} from "shared/BehaviourTree/Features/Blackboard/BlackboardConditions";

import { ActionWarnReturn } from "shared/BehaviourTree/Features/Log/LogActions";
import { ActionWalkToTarget } from "shared/BehaviourTree/Features/Movement.ts/MovementActions";
import { ActionComplexMoveNearSpawn } from "shared/BehaviourTree/Features/Movement.ts/MovementComplexActions";
import { CondIsNearSpawn } from "shared/BehaviourTree/Features/Movement.ts/MovementConditions";
import { ActionFindTarget } from "shared/BehaviourTree/Features/Target/TargetActions";
import { CondIsTargetCloserThan } from "shared/BehaviourTree/Features/Target/TargetConditions";

const Workspace = game.GetService("Workspace");

export class Mob {
	private behaviourTree: BehaviourTree;

	constructor(handle: BasePart, spawn: BasePart, mobType: string) {

		switch(mobType){
			case "Elevators":
				this.behaviourTree = ElevatorAgent(handle, spawn);
				break;
			case "Dasher":
				this.behaviourTree = DasherAgent(handle, spawn);
				break;
			default:
				warn(mobType)
				error("Mob type not found")
			break;
		}
	}

	public update() {
		this.behaviourTree.tick();
	}
}
