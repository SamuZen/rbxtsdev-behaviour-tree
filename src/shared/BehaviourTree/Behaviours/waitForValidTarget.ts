import { Selector } from "@rbxts/behaviour-tree";
import { hasValidTarget } from "../BaseNodes/hasValidTarget";
import { ActionFindTarget } from "../Features/Target/TargetActions";

const selector = new Selector();
selector.addChild(hasValidTarget);
selector.addChild(ActionFindTarget(10));

export { selector as lookForValidTarget };
