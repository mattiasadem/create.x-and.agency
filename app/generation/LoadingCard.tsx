// Reusable Loading Card Component
const LoadingCard = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-0 bg-[#020405]/95 backdrop-blur-md flex items-center justify-center z-10">
        <div className="w-full max-w-lg px-8 py-20 border border-white/10 rounded-xl bg-black/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            {children}
        </div>
    </div>
);

export default LoadingCard;
