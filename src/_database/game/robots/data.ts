import { DasherAgent_1 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_1";
import { RobotId } from "./ids";
import { BehaviourTree } from "@rbxts/behaviour-tree";
import { ElevatorAgent } from "shared/BehaviourTree/Agents/ElevatorAgent";
import { DasherAgent_2 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_2";
import { DasherAgent_0 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_0";
import { DasherAgent_3 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_3";
import { DasherAgent_4 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_4";
import { DasherAgent_5 } from "shared/BehaviourTree/Agents/Dasher/DasherAgent_5";

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
				[0]: DasherAgent_0,
				[1]: DasherAgent_1,
				[2]: DasherAgent_2,
				[3]: DasherAgent_3,
				[4]: DasherAgent_4,
				[5]: DasherAgent_5,
			},
		},
		[RobotId.Elevator]: {
			behaviours: {
				[1]: ElevatorAgent,
			},
		},
	},
};
