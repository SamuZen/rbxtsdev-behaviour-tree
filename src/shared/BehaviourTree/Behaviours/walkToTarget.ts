import { Action, MemorySequence, NodeStatus, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";

const sequence = new MemorySequence();

sequence.addChild(
	new Action((blackBoard: Blackboard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		const target = blackBoard.getVariable("target") as BasePart;
		const position = target.CFrame.Position;
		const speed = blackBoard.getVariable("speed") as number;

		//is close to position?
		const isClose = handle.CFrame.Position.sub(position).Magnitude < 3;
		if (isClose) {
			return NodeStatus.SUCCESS;
		}

		// Mover o Handle em direção a posição com a velocidade definida
		const direction = position.sub(handle.Position).Unit;
		handle.CFrame = handle.CFrame.add(direction.mul(speed));

		return NodeStatus.RUNNING;
	}),
);

export { sequence as walkToTarget };
