import { Action, BehaviourTree, Condition, Sequence } from "@rbxts/behaviour-tree";
import { Mob } from "shared/Mob/Mob";

const RunService = game.GetService("RunService");
const Workspace = game.GetService("Workspace");

const spawn1 = Workspace.FindFirstChild("Spawn1") as BasePart;
const spawn2 = Workspace.FindFirstChild("Spawn2") as BasePart;

function createMob(i: number, spawn: BasePart) {
	const part = new Instance("Part");
	part.Size = new Vector3(3, 1, 3);
	part.Name = tostring(i);
	part.Anchored = true;
	part.PivotTo(new CFrame(i * 0, 5, -30));
	part.Parent = Workspace;

	const mob = new Mob(part, spawn);
	RunService.Heartbeat.Connect(() => mob.update());
}

for (let i = 0; i < 2; i++) {
	createMob(i, spawn1);
}

for (let i = 0; i < 2; i++) {
	createMob(i, spawn2);
}