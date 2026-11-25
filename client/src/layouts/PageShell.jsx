import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { ldBreadcrumbs } from '../seo/head';

/** Standard layout for informational pages: coloured header band, breadcrumbs, H1, content. */
export default function PageShell({ title, seoTitle, description, path, lead, children, wide = false, jsonLd = [], noindex, status, icon }) {
  const crumbs = [{ name: 'Home', path: '/' }, { name: title, path }];
  return (
    <>
      <Seo title={seoTitle || title} description={description} path={path} noindex={noindex} status={status} jsonLd={[...jsonLd, ldBreadcrumbs(crumbs)]} />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <div className="page-hero__head">
            {icon}
            <div>
              <h1>{title}</h1>
              {lead && <p className="lead">{lead}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className={`container page-body${wide ? '' : ' page-body--narrow'}`}>{children}</div>
    </>
  );
}
