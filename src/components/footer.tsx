export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="page flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          A demo store using the{" "}
          <a href="https://fakestoreapi.com" className="font-medium text-ink hover:underline" target="_blank" rel="noopener noreferrer">
            Fake Store API
          </a>
          . No real orders or payments are taken.
        </p>
        <p>
          Built by{" "}
          <a href="https://ajaychoudhary.netlify.app/" className="font-medium text-ink hover:underline" target="_blank" rel="noopener noreferrer">
            Ajay Choudhary
          </a>
        </p>
      </div>
    </footer>
  );
}
