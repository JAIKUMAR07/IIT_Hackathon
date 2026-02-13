import { X, TrendingUp, TrendingDown, Target, Info } from "lucide-react";

const AnalysisModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0a0a15]/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-[#111122] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[#667eea]/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#667eea]/20 rounded-xl text-[#667eea]">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight">Spatial Analysis Details</h2>
                            <p className="text-sm text-gray-400">Comparing real-time vs historical ground truth</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Match Confidence</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-bold text-white">{data.matchPercentage}%</span>
                                <span className="text-sm text-[#43e97b]">Consistency</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Area Explored</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-bold text-white">{data.overlapArea}</span>
                                <span className="text-sm text-gray-400">ha</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h3>

                        {/* Common Area */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border-l-4 border-magenta-500 rounded-r-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-[#ff00ff]" />
                                <div>
                                    <p className="text-sm font-medium text-white">Overlapping (Stable) Area</p>
                                    <p className="text-xs text-gray-400">Verified ground consistency</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-white">{data.overlapArea} ha</span>
                        </div>

                        {/* Added Area */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border-l-4 border-cyan-500 rounded-r-lg">
                            <div className="flex items-center gap-4">
                                <TrendingUp className="w-5 h-5 text-[#00ffff]" />
                                <div>
                                    <p className="text-sm font-medium text-white">Added (New) Development</p>
                                    <p className="text-xs text-gray-400">Area detected in {data.plotLabel}</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-white">+{data.addedArea} ha</span>
                        </div>

                        {/* Lost Area */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border-l-4 border-orange-500 rounded-r-lg">
                            <div className="flex items-center gap-4">
                                <TrendingDown className="w-5 h-5 text-[#ff8c00]" />
                                <div>
                                    <p className="text-sm font-medium text-white">Lost (Removed) Area</p>
                                    <p className="text-xs text-gray-400">Missing from {data.compLabel}</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-white">-{data.lostArea} ha</span>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-[#667eea]/5 border border-[#667eea]/20 rounded-xl flex gap-3">
                        <Info className="w-5 h-5 text-[#667eea] flex-shrink-0" />
                        <p className="text-xs text-gray-400 leading-relaxed">
                            This analysis is based on spatial differencing between chosen UTM coordinates.
                            Positive values indicate area expansion in the primary dataset, while negative values reflect reduction compared to historical ground truth.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-black/20 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-[#667eea]/40 transition-all active:scale-95"
                    >
                        Acknowledge Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisModal;
