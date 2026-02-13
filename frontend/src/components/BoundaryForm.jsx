import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const BoundaryForm = ({ onSubmit, onCancel, mode = 'plot' }) => {
    const [formData, setFormData] = useState({
        // Shared / Plot fields
        district: '',
        sector: '',
        industrialArea: '',
        plotType: '',
        plotNumber: '',
        status: 'Available',
        // Boundary only fields
        category: '',
        location: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isBoundary = mode === 'boundary';

    return (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1b26]/90 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {isBoundary ? 'Boundary Information' : 'Plot Information'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isBoundary ? (
                        /* Boundary Mode Fields (Amenity Style) */
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g. GREEN AREA"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">District Name</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="Raipur"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g. Bartori"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Plot Type</label>
                                <input
                                    type="text"
                                    name="plotType"
                                    value={formData.plotType}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g. N/A"
                                />
                            </div>
                        </>
                    ) : (
                        /* Plot Mode Fields */
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">District</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Raipur"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Sector</label>
                                    <input
                                        type="text"
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Sector 1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Industrial Area</label>
                                <input
                                    type="text"
                                    name="industrialArea"
                                    value={formData.industrialArea}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g. Tilda"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Plot Type</label>
                                    <select
                                        name="plotType"
                                        value={formData.plotType}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all appearance-none [&>option]:bg-[#1a1b26]"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Industrial Purpose">Industrial Purpose</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Green Area">Green Area</option>
                                        <option value="Amenities">Amenities</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Plot Number</label>
                                    <input
                                        type="text"
                                        name="plotNumber"
                                        value={formData.plotNumber}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="89"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: 'Available' }))}
                                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${formData.status === 'Available'
                                                ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        Available
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: 'Allotted' }))}
                                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${formData.status === 'Allotted'
                                                ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.2)]'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        Allotted
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: 'Unavailable' }))}
                                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${formData.status === 'Unavailable'
                                                ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.2)]'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        Unavailable
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        Save Details
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BoundaryForm;
