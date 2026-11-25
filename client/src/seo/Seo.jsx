import { createContext, useContext, useEffect } from 'react';
import { headTags } from './head';
import { trackPageView } from '../utils/analytics';

/** On the server, pages write their SEO data into this collector during render. */
export const HeadContext = createContext(null);

export default function Seo(props) {
  const collector = useContext(HeadContext);
  if (collector) collector.data = props; // server-side render only

  const key = JSON.stringify(props);
  useEffect(() => {
    // Client: replace the managed head tags after navigation.
    document.head.querySelectorAll('[data-tkw]').forEach((el) => el.remove());
    const tpl = document.createElement('template');
    tpl.innerHTML = headTags(props);
    document.head.append(...tpl.content.childNodes);
    trackPageView(props.path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}
