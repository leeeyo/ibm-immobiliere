"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (e.target.value) params.set('sort', e.target.value);
    else params.delete('sort');
    router.push('/proprietes?' + params.toString());
  };

  return (
    <select
      onChange={handleChange}
      defaultValue={searchParams.get('sort') || ''}
      className="rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2 text-sm text-[var(--color-navy-900)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
    >
      <option value="">Plus récentes</option>
      <option value="price_asc">Prix croissant</option>
      <option value="price_desc">Prix décroissant</option>
      <option value="area_asc">Surface croissante</option>
      <option value="area_desc">Surface décroissante</option>
    </select>
  );
}
