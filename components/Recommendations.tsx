import React from 'react';

interface RecommendationsProps {
    recommendations: string[];
    isLoading: boolean;
}

const SkeletonLoader = () => (
     <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
             <div key={i} className="flex items-start p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="ml-3 w-full">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mt-2"></div>
                </div>
            </div>
        ))}
    </div>
);

export const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, isLoading }) => {

    const renderContent = () => {
         if (isLoading) {
            return <SkeletonLoader />;
        }
        
        if (recommendations.length === 0) {
            return (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                     <i className="fas fa-lightbulb fa-3x mb-4 text-gray-400 dark:text-gray-500"></i>
                    <p className="font-medium text-gray-700 dark:text-gray-300">AI recommendations are on standby</p>
                    <p className="text-sm">They will appear here after data analysis.</p>
                </div>
            );
        }

        return (
             <ul className="space-y-3 animate-fade-in">
                {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start p-4 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                        <div className="flex-shrink-0 pt-0.5">
                            <i className="fas fa-seedling text-emerald-500 dark:text-emerald-400"></i>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-gray-800 dark:text-gray-200">{rec}</p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">3. AI Recommendations</h2>
            {renderContent()}
        </div>
    );
};