import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell, TooltipPayload } from 'recharts';
import { ImpactData, LifeCycleStage } from '../types';

interface DashboardProps {
    impactData: ImpactData[];
    isLoading: boolean;
    theme: 'light' | 'dark';
}

const COLORS_LIGHT = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
const COLORS_DARK = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'];
const STAGE_ORDER = Object.values(LifeCycleStage);

const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                <p className="font-bold text-gray-800 dark:text-gray-100">{`${payload[0].name}`}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{`CO2eq: ${payload[0].value?.toFixed(2)} kg`}</p>
            </div>
        );
    }
    return null;
};

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mx-auto mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mx-auto mb-2"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
            <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mx-auto mb-2"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ impactData, isLoading, theme }) => {
    const COLORS = theme === 'light' ? COLORS_LIGHT : COLORS_DARK;

    const aggregatedByStage = useMemo(() => {
        const stageMap = new Map<string, number>();
        impactData.forEach(item => {
            stageMap.set(item.stage, (stageMap.get(item.stage) || 0) + item.co2eq);
        });

        return STAGE_ORDER.map(stage => ({
            name: stage,
            co2eq: stageMap.get(stage) || 0,
        })).filter(d => d.co2eq > 0);

    }, [impactData]);
    
    const aggregatedByMaterial = useMemo(() => {
         const materialMap = new Map<string, number>();
        impactData.forEach(item => {
            materialMap.set(item.material, (materialMap.get(item.material) || 0) + item.co2eq);
        });
        return Array.from(materialMap.entries()).map(([name, value]) => ({ name, value }));

    }, [impactData]);

    const totalImpact = useMemo(() => aggregatedByStage.reduce((sum, item) => sum + item.co2eq, 0), [aggregatedByStage]);


    const renderContent = () => {
        if (isLoading) {
            return <SkeletonLoader />;
        }

        if (impactData.length === 0) {
            return (
                <div className="flex justify-center items-center h-full min-h-[400px] text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                    <div>
                        <i className="fas fa-chart-bar fa-3x mb-4 text-gray-400 dark:text-gray-500"></i>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Dashboard is ready</h3>
                        <p>Add LCI data to visualize the environmental impact analysis.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="animate-fade-in">
                 <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Environmental Impact</h3>
                    <p className="text-4xl lg:text-5xl font-bold text-emerald-600 dark:text-emerald-400">{totalImpact.toFixed(2)} <span className="text-2xl font-normal text-gray-500 dark:text-gray-400">kg CO2eq</span></p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-md font-semibold text-center mb-2">Impact by Life Cycle Stage</h4>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={aggregatedByStage} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: theme === 'light' ? '#4b5563' : '#d1d5db' }} angle={-25} textAnchor="end" height={60} interval={0} />
                                <YAxis tick={{ fontSize: 12, fill: theme === 'light' ? '#4b5563' : '#d1d5db' }} label={{ value: 'kg CO2eq', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle', fill: theme === 'light' ? '#6b7280' : '#9ca3af' } }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'light' ? 'rgba(209, 213, 219, 0.3)' : 'rgba(75, 85, 99, 0.3)' }} />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                                <Bar dataKey="co2eq" fill={theme === 'light' ? '#10B981' : '#34D399'} name="CO2 equivalent"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     <div>
                        <h4 className="text-md font-semibold text-center mb-2">Contribution by Material</h4>
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={aggregatedByMaterial} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={{ fontSize: 12, fill: theme === 'light' ? '#374151' : '#f9fafb' }}>
                                {aggregatedByMaterial.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg CO2eq`} />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">2. Impact Visualization</h2>
            {renderContent()}
        </div>
    );
};