interface statItem {
  id: string;
  label: string;
  percentage: number;
}

interface staticProps {
  title?: string;
  stats: statItem[];
}

export function Statistica({ title, stats }: staticProps) {
  return (
    <section className="statistics">
      {title && <h2 className="title">{title}</h2>}

      <ul className="stat-list">
        {stats.map(({ id, label, percentage }) => (
          <li key={id} className="item">
            <span className="label">{label}</span>
            <span className="percentage">{percentage}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
