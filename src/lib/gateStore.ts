/**
 * The entry gate: the site opens on the card, and only unlocks once the
 * visitor double-clicks through it.
 *
 * Kept outside React for the same reason as the scroll and focus stores —
 * the card reads this every frame inside useFrame, and re-rendering the tree
 * sixty times a second to animate a gate would be absurd.
 */

export const gate = {
  /** true until the visitor has entered */
  active: true,
  /** set the moment they enter; drives the card's exit animation */
  exiting: false,
  /** seconds since exit began, advanced by the card's frame loop */
  exitT: 0,
  /** how far the pointer has dragged the card, in normalised units */
  dragX: 0,
  dragY: 0,
  /** spin the card has been given by flicking it */
  spin: 0,
};

type Listener = (entered: boolean) => void;
const listeners = new Set<Listener>();

export function onGateChange(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Called by the gate overlay on double-click / Enter. */
export function enterSite() {
  if (!gate.active || gate.exiting) return;
  gate.exiting = true;
  for (const fn of listeners) fn(true);
}

/** Called by the card once its exit animation has finished. */
export function finishExit() {
  gate.active = false;
}

export function resetGate() {
  gate.active = true;
  gate.exiting = false;
  gate.exitT = 0;
  gate.dragX = 0;
  gate.dragY = 0;
  gate.spin = 0;
}
