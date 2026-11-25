import { Link } from 'react-router';
import { Compass, Home } from 'lucide-react';
import PageShell from '../layouts/PageShell';
import SearchBox from '../components/SearchBox';
import ToolCard from '../components/ToolCard';
import IconBadge from '../components/IconBadge';
import { popularTools } from '../data/tools';

export default function NotFound() {
  return (
    <PageShell title="Page not found" seoTitle="404 – Page Not Found" description="The page you were looking for does not exist." path="/404/" noindex status={404}
      icon={<IconBadge icon={Compass} color="slate" size="lg" />}
      lead="Sorry, this page doesn’t exist or has moved. Try searching, or pick one of our popular tools.">
      <SearchBox variant="page" />
      <p className="mt-md"><Link to="/" className="btn btn--primary"><Home size={16} aria-hidden="true" /> Back to the homepage</Link></p>
      <h2 className="mt-xl">Popular tools</h2>
      <div className="grid grid--2">{popularTools().slice(0, 6).map((t) => <ToolCard key={t.id} tool={t} />)}</div>
    </PageShell>
  );
}
