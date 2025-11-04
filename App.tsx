import React, { useState, useEffect } from 'react';
import { DataInputForm } from './components/DataInputForm';
import { Dashboard } from './components/Dashboard';
import { Recommendations } from './components/Recommendations';
import { Header } from './components/Header';
import { LCIEntry, ImpactData } from './types';
import { analyzeLCAData } from './services/geminiService';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [lciEntries, setLciEntries] = useState<LCIEntry[]>([]);
    const [impactData, setImpactData] = useState<ImpactData[]>([]);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleDataSubmit = async (newEntry: Omit<LCIEntry, 'id'>) => {
        setIsLoading(true);
        setError(null);
        const updatedEntries = [...lciEntries, { ...newEntry, id: Date.now() }];
        setLciEntries(updatedEntries);
        await runAnalysis(updatedEntries);
    };

    const runAnalysis = async (entries: LCIEntry[]) => {
        if (entries.length === 0) {
            handleClearData();
            return;
        }
        setIsLoading(true);
        try {
            const result = await analyzeLCAData(entries);
            if (result.impacts && result.recommendations) {
                setImpactData(result.impacts);
                setRecommendations(result.recommendations);
            } else {
                 throw new Error("AI analysis returned an unexpected format.");
            }
        } catch (err) {
            console.error("Error during AI analysis:", err);
            setError("Failed to get analysis from AI. Please check your API key and try again.");
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleClearData = () => {
        setLciEntries([]);
        setImpactData([]);
        setRecommendations([]);
        setError(null);
    }

    const handleDeleteEntry = async (id: number) => {
        const updatedEntries = lciEntries.filter(entry => entry.id !== id);
        setLciEntries(updatedEntries);
        if (updatedEntries.length > 0) {
            // Re-run analysis with the remaining entries
            await runAnalysis(updatedEntries);
        } else {
            // If no entries left, clear everything
            handleClearData();
        }
    };

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    <div className="xl:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <DataInputForm 
                            onSubmit={handleDataSubmit} 
                            isLoading={isLoading} 
                            onClear={handleClearData} 
                            lciEntries={lciEntries}
                            onDeleteEntry={handleDeleteEntry}
                        />
                    </div>

                    <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
                        {error && (
                            <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 rounded-lg shadow-md text-center animate-fade-in">
                                <p>
                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                    <strong>Error:</strong> {error}
                                </p>
                            </div>
                        )}
                        <Dashboard impactData={impactData} isLoading={isLoading} theme={theme} />
                        <Recommendations recommendations={recommendations} isLoading={isLoading} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;