// Reusable Loading Card Component
const LoadingCard = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-0 bg-[#020405]/40 backdrop-blur-md flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1)_0%,_rgba(0,0,0,0)_70%)]" />
        <div className="w-full max-w-lg px-8 py-20 border border-white/10 rounded-xl bg-black/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    </div>
);

export default LoadingCard;
