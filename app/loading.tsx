export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-ivory-50)]">
      <div className="text-center">
        <div className="mx-auto mb-5 h-12 w-12 rounded-full border-2 border-[var(--color-gold-500)] border-t-transparent animate-spin" />
        <p className="text-sm uppercase tracking-widest text-[var(--color-stone-500)]">
          Chargement
        </p>
      </div>
    </div>
  );
}
