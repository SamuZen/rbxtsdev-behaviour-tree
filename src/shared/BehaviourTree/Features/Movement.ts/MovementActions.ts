import { Action, NodeStatus } from "@rbxts/behaviour-tree";
import { DebugRay } from "shared/Debug/DebugUtils";
const Workspace = game.GetService("Workspace");

export const ActionKeepDistanceFromTarget = (walkSpeed: number, goalDistance: number, margin: number): Action => {
	return new Action((blackBoard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		const target = blackBoard.getVariable("target") as BasePart;
		if (!target) {
			return NodeStatus.FAILURE;
		}

		const position = target.CFrame.Position;

		//is close to position?
		if (handle.Position.sub(position).Magnitude < goalDistance - margin) {
			const action = ActionWalkAwayFromTarget(walkSpeed, goalDistance + margin);
			action.tick(blackBoard);
			return action.status;
		} else if (handle.Position.sub(position).Magnitude > goalDistance + margin) {
			const action = ActionWalkToTarget(walkSpeed, goalDistance + margin);
			action.tick(blackBoard);
			return action.status;
		}

		return NodeStatus.SUCCESS;
	});
};

export const ActionWalkAwayFromTarget = (speed: number, goalDistance: number): Action => {
	return new Action((blackBoard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		const target = blackBoard.getVariable("target") as BasePart;
		if (!target) {
			return NodeStatus.FAILURE;
		}

		const position = target.CFrame.Position;
		const originalRotation = handle.CFrame.Rotation;

		//is close to position?
		if (handle.Position.sub(position).Magnitude > goalDistance) {
			return NodeStatus.SUCCESS;
		}

		// Mover o Handle em direção a posição com a velocidade definida
		const direction = position.sub(handle.Position).Unit.mul(-1);
		const destination = handle.CFrame.add(direction.mul(speed));

		//Raycast to check ground
		const rayHeight = 10;
		const rayOrigin = destination.Position.add(new Vector3(0, rayHeight, 0));
		const rayDirection = new Vector3(0, -20, 0);

		const raycastParams = new RaycastParams();
		raycastParams.FilterDescendantsInstances = [handle];
		raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

		const maxHeight = 8;
		const minHeight = 1;

		const raycastResult = Workspace.Raycast(rayOrigin, rayDirection, raycastParams);
		if (
			raycastResult &&
			(raycastResult.Distance - rayHeight > maxHeight || raycastResult.Distance - rayHeight < minHeight)
		) {
			const distance = raycastResult.Distance - rayHeight;
			warn(distance);
			if (distance > maxHeight) {
				warn("max");
				handle.CFrame = new CFrame(raycastResult.Position.add(new Vector3(0, maxHeight, 0))).mul(
					originalRotation,
				);
			} else if (distance < minHeight) {
				warn("min");
				handle.CFrame = new CFrame(raycastResult.Position.add(new Vector3(0, minHeight, 0))).mul(
					originalRotation,
				);
			}
		} else {
			warn("normal");
			handle.CFrame = destination;
		}

		return NodeStatus.SUCCESS;
	});
};

export const ActionWalkToTarget = (walkSpeed: number, goalDistance: number): Action => {
	return new Action((blackBoard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		const target = blackBoard.getVariable("target") as BasePart;
		if (!target) {
			return NodeStatus.FAILURE;
		}

		const position = target.CFrame.Position;

		//is close to position?
		if (handle.Position.sub(position).Magnitude < goalDistance) {
			return NodeStatus.SUCCESS;
		}

		// Mover o Handle em direção a posição com a velocidade definida
		const direction = position.sub(handle.Position).Unit;
		handle.CFrame = handle.CFrame.add(direction.mul(walkSpeed));

		return NodeStatus.SUCCESS;
	});
};

export const ActionRotateToTarget = (): Action => {
	return new Action((blackBoard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		const target = blackBoard.getVariable("target") as BasePart;
		if (!target) {
			return NodeStatus.FAILURE;
		}

		handle.CFrame = new CFrame(handle.GetPivot().Position, target.GetPivot().Position);
		return NodeStatus.SUCCESS;
	});
};

export const ActionMoveToPosition = (speed: number): Action => {
	return new Action((blackBoard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		const moveToPosition = blackBoard.getVariable("moveToPosition") as Vector3;

		//is close to position?
		const isClose = handle.CFrame.Position.sub(moveToPosition).Magnitude < speed;
		if (isClose) {
			handle.CFrame = new CFrame(moveToPosition);
			return NodeStatus.SUCCESS;
		}

		// Mover o Handle em direção a posição com a velocidade definida
		const direction = moveToPosition.sub(handle.Position).Unit;
		handle.CFrame = handle.CFrame.add(direction.mul(speed));

		return NodeStatus.RUNNING;
	});
};
