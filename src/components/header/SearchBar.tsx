
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchBar } from './search/useSearchBar';
import SearchInput from './search/SearchInput';
import SearchResults from './search/SearchResults';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useSearchBar();

  const handleFocus = () => {
    if (searchQuery.length >= 2 && searchResults.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <SearchInput
        searchQuery={searchQuery}
        inputRef={inputRef}
        onSearchInputChange={handleSearchInputChange}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        onFocus={handleFocus}
      />
      
      <SearchResults
        isDropdownOpen={isDropdownOpen}
        isSearching={isSearching}
        searchResults={searchResults}
        searchQuery={searchQuery}
        onResultClick={handleResultClick}
        onViewAllResults={handleViewAllResults}
      />
    </div>
  );
};

export default SearchBar;
