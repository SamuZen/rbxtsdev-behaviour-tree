import { DasherAgent_1 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_1";
import { RobotId } from "./ids";
import { BehaviourTree } from "@rbxts/behaviour-tree";
import { ElevatorAgent } from "shared/BehaviourTree/Agents/ElevatorAgent";
import { DasherAgent_2 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_2";

export type RobotsDBType = {
	robots: {
		[key in RobotId]: {
			behaviours: {
				[level: number]: (handle: BasePart, spawn: BasePart) => BehaviourTree;
			};
		};
	};
};

export const RobotsDB: RobotsDBType = {
	robots: {
		[RobotId.Dasher]: {
			behaviours: {
				[1]: DasherAgent_1,
				[2]: DasherAgent_2,
			},
		},
		[RobotId.Elevator]: {
			behaviours: {
				[1]: ElevatorAgent,
			},
		},
	},
};
