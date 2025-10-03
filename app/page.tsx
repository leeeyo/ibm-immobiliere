export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-slate-900">
            IBM Immobilière
          </h1>
          <p className="text-2xl text-slate-600">
            L&apos;immobilier en toute confiance
          </p>
          <div className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg">
            Phase 1 Complete: Architecture & Foundation ✓
          </div>
          <div className="mt-12 p-8 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Tech Stack Configured:</h2>
            <ul className="text-left space-y-2 text-slate-700">
              <li>✓ Next.js 15 with App Router</li>
              <li>✓ TypeScript</li>
              <li>✓ Tailwind CSS</li>
              <li>✓ MongoDB + Mongoose</li>
              <li>✓ Framer Motion</li>
              <li>✓ React Hook Form + Zod</li>
              <li>✓ Zustand</li>
              <li>✓ next-intl</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
