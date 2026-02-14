import React from "react";
import {
    LayoutDashboard,
    Map as MapIcon,
    Activity,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Users,
    Box,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const systems = [
        {
            title: "Land Monitoring System",
            description: "Real-time satellite surveillance and encroachment detection.",
            icon: <MapIcon className="w-8 h-8" />,
            stats: "24/7 Active",
            status: "Operational",
            color: "from-blue-500 to-cyan-400",
            path: "/map"
        },
        {
            title: "Spatial Analysis System",
            description: "Comparative study of land development and historical changes.",
            icon: <Activity className="w-8 h-8" />,
            stats: "98.2% Accuracy",
            status: "Optimized",
            color: "from-purple-500 to-pink-500",
            path: "/map"
        }
    ];

    const recentAnalyses = [
        { id: 1, location: "Raipur Industrial Zone", change: "+12.4 ha", type: "Addition", time: "2h ago" },
        { id: 2, location: "Bhilai Sector 4", change: "-2.1 ha", type: "Reduction", time: "5h ago" },
        { id: 3, location: "Durg Tech Park", change: "+5.8 ha", type: "Addition", time: "1d ago" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a15] text-white p-8">
            {/* Welcome Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    Command Center
                </h1>
                <p className="text-gray-400 mt-2">Welcome back. Monitoring 14 active industrial sectors.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
                {/* Main Systems */}
                <div className="col-span-2 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        {systems.map((system, idx) => (
                            <Link
                                key={idx}
                                to={system.path}
                                className="group relative p-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${system.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

                                <div className="relative z-10">
                                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${system.color} shadow-lg shadow-black/20 mb-6`}>
                                        {system.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{system.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                        {system.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-sm font-semibold">{system.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Performance</span>
                                            <span className="text-sm font-semibold">{system.stats}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <h3 className="text-xl font-bold mb-6">System Health</h3>
                        <div className="grid grid-cols-4 gap-6">
                            {[
                                { label: "API Latency", value: "24ms", trend: "+2%", icon: <Activity className="text-blue-400" /> },
                                { label: "Storage", value: "84%", trend: "Stable", icon: <Box className="text-purple-400" /> },
                                { label: "Users Online", value: "12", trend: "+4", icon: <Users className="text-cyan-400" /> },
                                { label: "Reports", value: "156", trend: "+12", icon: <CheckCircle2 className="text-green-400" /> },
                            ].map((stat, idx) => (
                                <div key={idx} className="p-4 bg-white/5 rounded-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        {stat.icon}
                                        <span className="text-xs text-green-400 font-medium">{stat.trend}</span>
                                    </div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Activity */}
                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold">Recent Monitoring</h3>
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="space-y-4">
                            {recentAnalyses.map((analysis) => (
                                <div key={analysis.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${analysis.type === 'Addition' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {analysis.type === 'Addition' ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">{analysis.location}</p>
                                        <p className="text-xs text-gray-500">{analysis.time} • {analysis.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-mono ${analysis.type === 'Addition' ? 'text-green-400' : 'text-red-400'}`}>
                                            {analysis.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                            View All Logs
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                            <AlertCircle className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-white mb-2">System Alert</h3>
                            <p className="text-white/80 text-sm mb-4">
                                Unusual encroachment detected in Sector 9. Immediate review recommended.
                            </p>
                            <Link
                                to="/map"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#667eea] rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                            >
                                Review Map
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
