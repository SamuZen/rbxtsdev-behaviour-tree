import { Action, MemorySequence, NodeStatus, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";

const sequence = new MemorySequence();

//pick random position around
sequence.addChild(
	new Action((blackBoard: Blackboard) => {
		const originPosition = blackBoard.getVariable("spawnPosition") as Vector3;
		const wanderDistance = blackBoard.getVariable("wanderDistance") as number;
		const minDistance = blackBoard.getVariable("minDistance") as number;

		const wanderPosition = originPosition.add(
			new Vector3(math.random(-wanderDistance, wanderDistance), 0, math.random(-wanderDistance, wanderDistance)),
		);
		blackBoard.setVariable("wanderPosition", wanderPosition);
	}),
);

sequence.addChild(
	new Action((blackBoard: Blackboard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		const wanderPosition = blackBoard.getVariable("wanderPosition") as Vector3;
		const speed = blackBoard.getVariable("speed") as number;

		//is close to position?
		const isClose = handle.Position.sub(wanderPosition).Magnitude < (blackBoard.getVariable("speed") as number);
		if (isClose) {
			handle.CFrame = new CFrame(wanderPosition);
			return NodeStatus.SUCCESS;
		}

		// Mover o Handle em direção a posição com a velocidade definida
		const direction = wanderPosition.sub(handle.Position).Unit;
		handle.CFrame = handle.CFrame.add(direction.mul(speed));

		return NodeStatus.RUNNING;
	}),
);

sequence.addChild(
	new Action((blackBoard: Blackboard) => {
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

export { sequence as walkAround };
