import type { NodeStatus } from "../data/nodes";
import { SCENARIOS } from "../data/scenarios";

/**
 * Pure function: given a scenario key and current round number,
 * returns the live status map for all nodes.
 * round = -1 → all operational (idle state)
 */
export function computeLiveStatus(
  scenarioKey: string,
  simRound: number
): Record<string, NodeStatus> {
  if (simRound < 0 || !SCENARIOS[scenarioKey]) return {};

  const scenario = SCENARIOS[scenarioKey];
  const status: Record<string, NodeStatus> = {};

  for (let r = 0; r <= simRound && r < scenario.cascade.length; r++) {
    for (const ev of scenario.cascade[r].events) {
      status[ev.nodeId] = ev.next;
    }
  }
  return status;
}

/**
 * Returns the final status map (all rounds completed) for a scenario.
 */
export function getFinalStatus(scenarioKey: string): Record<string, NodeStatus> {
  return SCENARIOS[scenarioKey]?.finalStatus ?? {};
}

/**
 * Returns the current round title for display in the cascade timeline.
 */
export function getRoundTitle(scenarioKey: string, round: number): string {
  const cascade = SCENARIOS[scenarioKey]?.cascade ?? [];
  return cascade[round]?.title ?? "";
}

/**
 * Total number of cascade rounds for a scenario.
 */
export function getTotalRounds(scenarioKey: string): number {
  return SCENARIOS[scenarioKey]?.cascade.length ?? 0;
}
