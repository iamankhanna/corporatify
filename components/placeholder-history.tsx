export function PlaceholderHistory() {
  return (
    <div className="rounded-[1.5rem] border border-black/10 bg-white/80 p-5 shadow-card">
      <p className="text-xs uppercase tracking-[0.3em] text-moss">
        Coming next
      </p>
      <h3 className="mt-3 text-2xl text-ink">Saved rewrite history</h3>
      <p className="mt-3 text-sm leading-7 text-black/70">
        The blueprint includes authenticated history and saved templates. This
        initial scaffold keeps the UI and API ready for Supabase-backed storage.
      </p>
    </div>
  );
}
