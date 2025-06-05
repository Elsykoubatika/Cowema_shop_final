
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHybridProducts } from '../../../hooks/useHybridProducts';
import { Product } from '../../../types/product';

export const useSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { products, searchProducts } = useHybridProducts();
  
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults([]);
      setIsDropdownOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }, [searchQuery, navigate]);
  
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      setIsSearching(true);
      setIsDropdownOpen(true);
      
      // Simulate search delay for better UX
      setTimeout(() => {
        const results = searchProducts(query).slice(0, 6); // Limit to 6 results
        setSearchResults(results);
        setIsSearching(false);
      }, 200);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
    }
  }, [searchProducts]);

  const handleResultClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
    setSearchResults([]);
    setIsDropdownOpen(false);
    setSearchQuery('');
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsDropdownOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    searchQuery,
    searchResults,
    isDropdownOpen,
    isSearching,
    dropdownRef,
    inputRef,
    handleSearch,
    handleSearchInputChange,
    handleResultClick,
    clearSearch,
    setIsDropdownOpen
  };
};
