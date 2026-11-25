import { Link } from 'react-router';
import { Clock } from 'lucide-react';
import PostArt from './PostArt';

export const formatPostDate = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' });

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/blog/${post.slug}/`} className="post-card__link">
        <PostArt category={post.category} />
        <div className="post-card__body">
          <span className="post-card__cat">{post.category}</span>
          <h3 className="post-card__title">{post.title}</h3>
          <p className="post-card__desc">{post.description}</p>
          <span className="post-card__meta">
            <time dateTime={post.published}>{formatPostDate(post.published)}</time>
            <span aria-hidden="true">·</span>
            <Clock size={14} aria-hidden="true" /> {post.readMinutes} min read
          </span>
        </div>
      </Link>
    </article>
  );
}
