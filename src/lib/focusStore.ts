/**
 * Which project the pointer is currently over.
 *
 * Deliberately not React state: the DOM cards write to it on hover and the
 * WebGL field reads it inside useFrame, so hovering a card never re-renders
 * the React tree — it just moves a uniform.
 */

import { PROJECTS } from './content';

export const focus = {
  /** slug of the hovered project, or null */
  slug: null as string | null,
  /** world-space position of that project's cluster */
  pos: [0, 0, 0] as [number, number, number],
  /** eased 0→1, so the field reacts with weight instead of snapping */
  amt: 0,
};

export function setFocus(slug: string | null) {
  focus.slug = slug;
  if (slug) {
    const p = PROJECTS.find((x) => x.slug === slug);
    if (p) focus.pos = p.pos;
  }
}
