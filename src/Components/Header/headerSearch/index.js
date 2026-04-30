import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../Client'; // Adjust path to your Supabase client
import './index.css';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length > 1) { // Start searching after 2 letters
                const { data, error } = await supabase
                    .from('products')
                    .select('id, name') // Only fetch id and name for speed
                    .ilike('name', `%${searchQuery}%`)
                    .limit(6); // Limit to top 6 matches

                if (!error) setSuggestions(data);
            } else {
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300); // Debounce to prevent too many DB calls

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          // Change this line:
          navigate(`/products?q=${encodeURIComponent(searchQuery)}`); 
          setSuggestions([]);
      }
  };

    return (
        <div className="search-wrapper">
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Cherchez le produit qui vous convient"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setTimeout(() => setSuggestions([]), 200)} // Hide on blur
                />
                <button type="submit" className="search-btn">
                    <FaSearch />
                    <span>Rechercher</span>
                </button>
            </form>

            {/* Floating Suggestions List */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((item) => (
                        <li key={item.id}>
                            <Link to={`/product/${item.id}`} onClick={() => setSuggestions([])}>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;