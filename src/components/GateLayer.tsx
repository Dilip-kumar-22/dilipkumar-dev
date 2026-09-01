'use client';

import { useState } from 'react';
import CardGate from './CardGate';

/** Holds the entered/not-entered state so page.tsx can stay a server component. */
export default function GateLayer() {
  const [entered, setEntered] = useState(false);
  if (entered) return null;
  return <CardGate onEnter={() => setEntered(true)} />;
}
