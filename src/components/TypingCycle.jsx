import { useState, useEffect } from 'react';

/*
 * TypingCycle — types a phrase, pauses, deletes it, then moves to the next,
 * looping forever (same effect as the readme-typing-svg badge).
 *
 * With `once`, it types the first phrase a single time and keeps the cursor
 * blinking. The text wraps naturally, so it never overflows small screens.
 */
const TypingCycle = ({
  phrases = [],
  typingSpeed = 90,
  deletingSpeed = 45,
  pause = 1600,
  startDelay = 0,
  once = false,
  className = 'typing-cycle',
}) => {
  const [ready, setReady] = useState(startDelay === 0);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    if (!ready) {
      const t = setTimeout(() => setReady(true), startDelay);
      return () => clearTimeout(t);
    }

    const current = phrases[index % phrases.length];
    const atFull = !deleting && text === current;
    if (atFull && once) return; // typed once — stop here

    const atEmpty = deleting && text === '';
    const delay = atFull ? pause : deleting ? deletingSpeed : typingSpeed;

    const timeout = setTimeout(() => {
      if (atFull) {
        setDeleting(true);
      } else if (atEmpty) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [ready, text, deleting, index, phrases, once, startDelay, typingSpeed, deletingSpeed, pause]);

  // An invisible copy of the longest phrase sits in the same grid cell as the
  // typed text, reserving its final width and height so nothing around it
  // shifts while typing.
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), '');

  return (
    <>
      <span className="typing-wrap" aria-hidden="true">
        <span className={`typing-ghost ${className}`}>
          {longest}
          <span className="typing-cursor"></span>
        </span>
        <span className={className}>
          {text}
          <span className="typing-cursor"></span>
        </span>
      </span>
      <span className="sr-only">{phrases.join('. ')}</span>
    </>
  );
};

export default TypingCycle;
