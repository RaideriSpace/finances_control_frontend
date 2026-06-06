"use client";

export function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold text-white font-space-grotesk">FC</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-600 text-center">
            RaideriSpace - © Copyright - 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
