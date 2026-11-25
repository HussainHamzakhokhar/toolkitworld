import { SITE } from '../config/site';

export const operator = () => SITE.ownerName || 'the operator of ToolKitWorld';
export const contactLine = () =>
  SITE.contactEmail ? <>by email at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> or through our <a href="/contact/">contact page</a></> : <>through our <a href="/contact/">contact page</a></>;

export default function LegalMeta() {
  const d = new Date(SITE.launchDate + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
  return <p className="legal-meta">Last updated: <time dateTime={SITE.launchDate}>{d}</time></p>;
}
