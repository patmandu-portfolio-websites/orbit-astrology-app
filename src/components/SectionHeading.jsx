import { ArrowUpRight } from 'lucide-react';

export default function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading">
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>
    {action && <a className="text-link" href={action.href}>{action.label}<ArrowUpRight size={15} /></a>}
  </div>;
}
