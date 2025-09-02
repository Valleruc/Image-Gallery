'use client';

import { useState, useRef } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef(null);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        onSearch(value);
    };

    const handleClear = () => {
        setSearchValue('');
        onSearch('');
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(input) => handleSearchChange(input.target.value)}
                placeholder="Search Images..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            )}
        </div>
    )
}
