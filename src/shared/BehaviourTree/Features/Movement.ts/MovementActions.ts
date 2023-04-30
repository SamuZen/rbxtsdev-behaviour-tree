import { Action, NodeStatus } from "@rbxts/behaviour-tree";

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
			// Mover o Handle em direção a posição com a velocidade definida
			const direction = position.sub(handle.Position).Unit.mul(-1);
			handle.CFrame = handle.CFrame.add(direction.mul(walkSpeed));
		} else if (handle.Position.sub(position).Magnitude > goalDistance + margin) {
			// Mover o Handle em direção a posição com a velocidade definida
			const direction = position.sub(handle.Position).Unit;
			handle.CFrame = handle.CFrame.add(direction.mul(walkSpeed));
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
