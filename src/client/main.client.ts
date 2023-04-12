import { Action, BehaviourTree, Condition, Sequence } from "@rbxts/behaviour-tree";
import { Mob } from "shared/Mob/Mob";

const RunService = game.GetService("RunService");
const Workspace = game.GetService("Workspace");

const part = new Instance("Part");
part.Anchored = true;
part.PivotTo(new CFrame(0, 5, -30));
part.Parent = Workspace;

const mob = new Mob(part);
RunService.Heartbeat.Connect(() => mob.update());
