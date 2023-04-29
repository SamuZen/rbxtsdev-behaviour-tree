import { Action, MemorySequence, NodeStatus } from "@rbxts/behaviour-tree";

const Players = game.GetService("Players");

export const ActionComplexMoveNearSpawn = (): MemorySequence => {
	const memorySequence = new MemorySequence();

	memorySequence.addChild(
		new Action((blackBoard) => {
			const originPosition = blackBoard.getVariable("spawnPosition") as Vector3;
			const wanderDistance = blackBoard.getVariable("wanderDistance") as number;

			const wanderPosition = originPosition.add(
				new Vector3(
					math.random(-wanderDistance, wanderDistance),
					0,
					math.random(-wanderDistance, wanderDistance),
				),
			);
			blackBoard.setVariable("moveToPosition", wanderPosition);
			return NodeStatus.SUCCESS;
		}),
	);

	memorySequence.addChild(
		new Action((blackBoard) => {
			const handle = blackBoard.getVariable("handle") as BasePart;
			const moveToPosition = blackBoard.getVariable("moveToPosition") as Vector3;
			const speed = blackBoard.getVariable("speed") as number;

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
		}),
	);

	memorySequence.addChild(
		new Action((blackBoard) => {
			const t = blackBoard.getVariable("waitTime") as number;
			if (blackBoard.getVariable("endTime") !== undefined) {
				const timeLeft = (blackBoard.getVariable("endTime") as number) - time();
				if (timeLeft <= 0) {
					blackBoard.setVariable("endTime", undefined);
					return NodeStatus.SUCCESS;
				}
				return NodeStatus.RUNNING;
			}

			const endTime = time() + t;
			blackBoard.setVariable("endTime", endTime);
			return NodeStatus.RUNNING;
		}),
	);

	return memorySequence;
};
