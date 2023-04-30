import { DasherAgent } from "shared/BehaviourTree/Agents/DasherAgent";
import { RobotId } from "./ids";
import { BehaviourTree } from "@rbxts/behaviour-tree";
import { ElevatorAgent } from "shared/BehaviourTree/Agents/ElevatorAgent";

export type RobotsDBType = {
    robots: {
        [key in RobotId]: {
            name: string,
            description: string,
            behaviour: (handle: BasePart, spawn: BasePart) => BehaviourTree;
            baseStats: {
                health: number,
            },
        }
    }
}

export const RobotsDB: RobotsDBType = {
    robots: {
        [RobotId.Dasher]: {
            name: "Dasher",
            description: "Dasher is a robot that dashes around the map.",
            behaviour: DasherAgent,
            baseStats: {
                health: 100,
            }
        },
        [RobotId.Elevator]: {
            name: "Elevator",
            description: "Elevator is a robot that goes up and down.",
            behaviour: ElevatorAgent,
            baseStats: {
                health: 100,
            }
        }
    }
}