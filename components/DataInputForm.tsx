import React, { useState } from 'react';
import { LifeCycleStage, LCIEntry } from '../types';

interface DataInputFormProps {
    onSubmit: (data: { material: string; quantity: number; unit: string; stage: LifeCycleStage }) => void;
    isLoading: boolean;
    onClear: () => void;
    lciEntries: LCIEntry[];
    onDeleteEntry: (id: number) => void;
}

interface FormErrors {
    material?: string;
    quantity?: string;
    unit?: string;
}

const commonMaterials = [
  "Aluminum (Primary)",
  "Aluminum (Recycled)",
  "Cardboard",
  "Concrete",
  "Cotton",
  "Glass",
  "HDPE Plastic",
  "LDPE Plastic",
  "Leather",
  "PET Plastic",
  "Polypropylene (PP)",
  "Polyester",
  "Rubber",
  "Steel (Primary)",
  "Steel (Recycled)",
  "Wood (Hardwood)",
  "Wood (Softwood)",
];

export const DataInputForm: React.FC<DataInputFormProps> = ({ onSubmit, isLoading, onClear, lciEntries, onDeleteEntry }) => {
    const [material, setMaterial] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg');
    const [stage, setStage] = useState<LifeCycleStage>(LifeCycleStage.RAW_MATERIAL);
    const [errors, setErrors] = useState<FormErrors>({});
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!material.trim()) {
            newErrors.material = 'Material name is required.';
        }
        const numQuantity = parseFloat(quantity);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            newErrors.quantity = 'Quantity must be a positive number.';
        }
        if (!unit.trim()) {
            newErrors.unit = 'Unit is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSubmit({
            material,
            quantity: parseFloat(quantity),
            unit,
            stage,
        });
        setMaterial('');
        setQuantity('');
        setErrors({});
    };

    const handleQuantityAndUnitChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof FormErrors) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: undefined}));
        }
    }

    const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMaterial(value);

        if (errors.material) {
            setErrors(prev => ({...prev, material: undefined }));
        }

        if (value.trim()) {
            const filteredSuggestions = commonMaterials.filter(m =>
                m.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(filteredSuggestions.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setMaterial(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };


    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">1. Add LCI Data</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Material / Process</label>
                    <div className="relative">
                        <input
                            id="material"
                            type="text"
                            value={material}
                            onChange={handleMaterialChange}
                            onFocus={handleMaterialChange}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            placeholder="e.g., Recycled Plastic Pellets"
                            className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.material ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                            aria-invalid={!!errors.material}
                            aria-describedby={errors.material ? 'material-error' : undefined}
                            autoComplete="off"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onMouseDown={() => handleSuggestionClick(suggestion)}
                                        className="px-3 py-2 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-sm text-gray-700 dark:text-gray-200"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {errors.material && <p id="material-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.material}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={handleQuantityAndUnitChange(setQuantity, 'quantity')}
                            placeholder="e.g., 100"
                            className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                            min="0"
                            step="any"
                            aria-invalid={!!errors.quantity}
                            aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                        />
                         {errors.quantity && <p id="quantity-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>}
                    </div>
                    <div>
                         <label htmlFor="unit" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Unit</label>
                        <input
                            id="unit"
                            type="text"
                            value={unit}
                            onChange={handleQuantityAndUnitChange(setUnit, 'unit')}
                            className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.unit ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                            aria-invalid={!!errors.unit}
                            aria-describedby={errors.unit ? 'unit-error' : undefined}
                        />
                         {errors.unit && <p id="unit-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.unit}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="stage" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Life Cycle Stage</label>
                    <select
                        id="stage"
                        value={stage}
                        onChange={(e) => setStage(e.target.value as LifeCycleStage)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                    >
                        {Object.values(LifeCycleStage).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                 <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-plus-circle mr-2"></i>
                                Add & Analyze
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 flex-grow">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Inventory</h3>
                    {lciEntries.length > 0 && (
                        <button
                           type="button"
                           onClick={onClear}
                           disabled={isLoading}
                           className="py-1 px-3 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                            <i className="fas fa-trash mr-1"></i> Clear All
                        </button>
                   )}
                 </div>
                 <div className="space-y-2 pr-2 max-h-64 overflow-y-auto">
                    {lciEntries.length > 0 ? (
                        lciEntries.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md animate-fade-in">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{entry.material}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{entry.quantity} {entry.unit} - {entry.stage}</p>
                                </div>
                                <button
                                    onClick={() => onDeleteEntry(entry.id)}
                                    disabled={isLoading}
                                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                    aria-label={`Delete entry for ${entry.material}`}
                                >
                                    <i className="fas fa-times-circle"></i>
                                </button>
                            </div>
                        ))
                    ) : (
                         <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No data entries added yet.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};