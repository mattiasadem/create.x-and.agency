import Link from "next/link";

export default function HomeHeroBadge() {
  return (
    <div className="flex justify-center mb-6">
      <Link
        className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-xs font-medium text-cyan-200 flex items-center gap-2 backdrop-blur-sm hover:bg-cyan-900/40 transition-all pointer-events-none"
        href="#"
        onClick={(e) => e.preventDefault()}
      >
        Introducing x-and V1
      </Link>
    </div>
  );
}
