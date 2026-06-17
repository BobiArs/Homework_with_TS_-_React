export function Header({ items }: { items: string[] }) {
  return (
    <header className="header">
      <div className="logo">Site by Bobi</div>
      <nav className="nav">
        {items.map((item, indx) => (
          <a key={indx} href="#">
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
