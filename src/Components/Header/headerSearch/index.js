import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import './index.css';


const Search = () => {

    const [searchQuery, setSearchQuery] = useState('')
  
    return (
        <div className="container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Cherchez le produit qui vous convient"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <FaSearch />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
    )
}

export default Search;