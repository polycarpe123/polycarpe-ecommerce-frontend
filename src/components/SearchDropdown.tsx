import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { searchService, type SearchResult, type SearchSuggestion } from '../services/searchService';

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  placeholder = "Search for products, categories, brands...", 
  className = "",
  onSearch 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        setResults([]);
        setSuggestions([]);
        loadPopularSearches();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  // Load popular searches on mount
  useEffect(() => {
    loadPopularSearches();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPopularSearches = async () => {
    try {
      const searches = await searchService.getPopularSearches();
      setPopularSearches(searches);
    } catch (error) {
      console.error('Error loading popular searches:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const [searchResults, searchSuggestions] = await Promise.all([
        searchService.searchProducts(query, selectedCategory),
        searchService.getSuggestions(query)
      ]);
      
      setResults(searchResults);
      setSuggestions(searchSuggestions);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (query.trim() || popularSearches.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    onSearch?.(suggestion.text);
    navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    navigate(`/product/${result.id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      onSearch?.(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handlePopularSearchClick = (search: string) => {
    setQuery(search);
    setIsOpen(false);
    onSearch?.(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const categories = ['All', 'Men\'s Fashion', 'Women\'s Fashion', 'Accessories', 'Shoes'];

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 text-gray-700 bg-transparent outline-none"
        />
        
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1 text-gray-600 bg-transparent outline-none text-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        )}
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 flex items-center gap-2"
        >
          <Search size={16} />
          Search
        </button>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : (
            <>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="border-b border-gray-200">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {suggestion.type === 'category' && <span className="text-xs">📁</span>}
                          {suggestion.type === 'brand' && <span className="text-xs">🏷️</span>}
                          {suggestion.type === 'query' && <Search size={12} className="text-gray-400" />}
                        </div>
                        <span className="text-sm text-gray-700">{suggestion.text}</span>
                      </div>
                      {suggestion.count && (
                        <span className="text-xs text-gray-400">{suggestion.count} items</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              {results.length > 0 && (
                <div className="border-b border-gray-200">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Products
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 group"
                    >
                      <img 
                        src={result.image} 
                        alt={result.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500">{result.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">${result.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              {!query && suggestions.length === 0 && results.length === 0 && popularSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={12} />
                    Popular Searches
                  </div>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularSearchClick(search)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Search size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query && suggestions.length === 0 && results.length === 0 && (
                <div className="p-8 text-center">
                  <Search size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords or browse categories</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
