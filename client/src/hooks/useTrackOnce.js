import { useCallback, useRef } from 'react';
import { track } from '../utils/analytics';

/** Returns a function that sends a "tool_use" analytics event at most once per page view. */
export default function useTrackOnce(toolId) {
  const sent = useRef(false);
  return useCallback((extra = {}) => {
    if (sent.current) return;
    sent.current = true;
    track('tool_use', { tool: toolId, ...extra });
  }, [toolId]);
}
