/** Coloured rounded square holding a Lucide icon. color = blue | red | violet | teal | slate */
export default function IconBadge({ icon: Icon, color = 'blue', size = 'md' }) {
  return (
    <span className={`icon-badge icon-badge--${color} icon-badge--${size}`} aria-hidden="true">
      <Icon strokeWidth={2} />
    </span>
  );
}
