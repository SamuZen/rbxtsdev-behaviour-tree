import { Action, MemorySequence, NodeStatus } from "@rbxts/behaviour-tree";
import { ActionMoveToPosition } from "./MovementActions";
import { DebugWaypoints } from "shared/Debug/DebugUtils";

const Players = game.GetService("Players");

export const ActionComplexMoveThroughWaypoints = (speed: number): MemorySequence => {
	const parentNode = new MemorySequence();

	parentNode.addChild(
		new Action((blackBoard) => {
			const handle = blackBoard.getVariable("handle") as BasePart;
			const waypoints = blackBoard.getVariable("waypoints") as Array<Vector3>;
			let currentWaypointIndex = blackBoard.getVariable("currentWaypointIndex") as number;

			if (currentWaypointIndex === undefined) {
				currentWaypointIndex = 0;
				blackBoard.setVariable("currentWaypointIndex", currentWaypointIndex);
			}

			if (currentWaypointIndex >= waypoints.size()) {
				blackBoard.setVariable("currentWaypointIndex", 0);
				return NodeStatus.SUCCESS;
			}

			const currentWaypoint = waypoints[currentWaypointIndex];
			//is close to currentWaypoint?
			const isClose = handle.CFrame.Position.sub(currentWaypoint).Magnitude < speed;
			if (isClose) {
				handle.CFrame = new CFrame(currentWaypoint);
				currentWaypointIndex += 1;
				blackBoard.setVariable("currentWaypointIndex", currentWaypointIndex);
				return NodeStatus.RUNNING;
			}

			// Mover o Handle em direção a posição com a velocidade definida
			const direction = currentWaypoint.sub(handle.Position).Unit;
			handle.CFrame = handle.CFrame.add(direction.mul(speed));

			return NodeStatus.RUNNING;
		}),
	);

	return parentNode;
};

export const ActionComplexDashForward = (walkSpeed: number, extraDistance: number): MemorySequence => {
	const memorySequence = new MemorySequence();

	//get position behind the target
	memorySequence.addChild(
		new Action((blackBoard) => {
			const handle = blackBoard.getVariable("handle") as BasePart;
			const target = blackBoard.getVariable("target") as BasePart;

			const distanceToTarget = handle.Position.sub(target.Position).Magnitude;
			const direction = target.Position.sub(
				new Vector3(handle.Position.X, target.Position.Y, handle.Position.Z),
			).Unit;

			const endPosition = handle.Position.add(direction.mul(distanceToTarget + extraDistance));
			blackBoard.setVariable("moveToPosition", endPosition);
			DebugWaypoints([handle.Position, endPosition], Color3.fromRGB(255, 0, 0), 3);
			return NodeStatus.SUCCESS;
		}),
	);

	memorySequence.addChild(ActionMoveToPosition(walkSpeed));

	return memorySequence;
};

export const ActionComplexMoveNearSpawn = (walkSpeed: number, restTime: number): MemorySequence => {
	const memorySequence = new MemorySequence();

	memorySequence.addChild(
		new Action((blackBoard) => {
			const spawnPart = blackBoard.getVariable("spawnPart") as BasePart;
			const handle = blackBoard.getVariable("handle") as BasePart;

			const x = (math.random() - 0.5) * spawnPart.Size.X;
			const y = (math.random() - 0.5) * spawnPart.Size.Y;
			const z = (math.random() - 0.5) * spawnPart.Size.Z;

			const newCFrame = spawnPart.CFrame.mul(new CFrame(x, y, z));
			blackBoard.setVariable("moveToPosition", newCFrame.Position);

			DebugWaypoints([handle.Position, newCFrame.Position], Color3.fromRGB(255, 0, 0), 3);

			return NodeStatus.SUCCESS;
		}),
	);

	memorySequence.addChild(
		new Action((blackBoard) => {
			const handle = blackBoard.getVariable("handle") as BasePart;
			const moveToPosition = blackBoard.getVariable("moveToPosition") as Vector3;

			//is close to position?
			const isClose = handle.CFrame.Position.sub(moveToPosition).Magnitude < walkSpeed;
			if (isClose) {
				handle.CFrame = new CFrame(moveToPosition);
				return NodeStatus.SUCCESS;
			}

			// Mover o Handle em direção a posição com a velocidade definida
			const direction = moveToPosition.sub(handle.Position).Unit;
			handle.CFrame = handle.CFrame.add(direction.mul(walkSpeed));

			return NodeStatus.RUNNING;
		}),
	);

	memorySequence.addChild(
		new Action((blackBoard) => {
			if (blackBoard.getVariable("endTime") !== undefined) {
				const timeLeft = (blackBoard.getVariable("endTime") as number) - time();
				if (timeLeft <= 0) {
					blackBoard.setVariable("endTime", undefined);
					return NodeStatus.SUCCESS;
				}
				return NodeStatus.RUNNING;
			}

			const endTime = time() + restTime;
			blackBoard.setVariable("endTime", endTime);
			return NodeStatus.RUNNING;
		}),
	);

	return memorySequence;
};
