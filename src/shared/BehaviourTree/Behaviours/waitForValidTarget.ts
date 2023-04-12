import { Selector } from "@rbxts/behaviour-tree";
import { findNewTarget } from "../BaseNodes/findNewTarget";
import { hasValidTarget } from "../BaseNodes/hasValidTarget";

const selector = new Selector();
selector.addChild(hasValidTarget);
selector.addChild(findNewTarget);

export { selector as waitForValidTarget };
