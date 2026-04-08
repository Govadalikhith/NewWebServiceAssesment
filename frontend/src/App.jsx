import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Filter, Package, Truck, DollarSign } from 'lucide-react';

const API_BASE = '/api';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [inventoryGrouped, setInventoryGrouped] = useState([]);
  const [view, setView] = useState('search'); // 'search' or 'inventory'
  const [loading, setLoading] = useState(false);

  // Fetch search results (Part A)
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/search`, {
        params: { q: searchTerm, category, minPrice, maxPrice }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error', error);
      alert('Search failed');
    }
    setLoading(false);
  };

  // Fetch grouped inventory (Part B)
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/inventory`);
      setInventoryGrouped(response.data);
    } catch (error) {
      console.error('Inventory fetch error', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (view === 'inventory') {
      fetchInventory();
    } else {
      handleSearch();
    }
  }, [view]);

  return (
    <div className="container">
      <h1>InvenTracker Pro</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${view === 'search' ? '' : 'btn-outline'}`} 
          onClick={() => setView('search')}
          style={{ background: view === 'search' ? 'var(--primary)' : 'transparent', border: '1px solid var(--primary)' }}
        >
          <Search size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Product Search (Part A)
        </button>
        <button 
          className={`btn ${view === 'inventory' ? '' : 'btn-outline'}`} 
          onClick={() => setView('inventory')}
          style={{ background: view === 'inventory' ? 'var(--primary)' : 'transparent', border: '1px solid var(--primary)' }}
        >
          <Package size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Inventory Management (Part B)
        </button>
      </div>

      {view === 'search' ? (
        <div className="animate-fade-in">
          <div className="card search-section">
            <input 
              type="text" 
              placeholder="Search product name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Furniture">Furniture</option>
            </select>
            <input 
              type="number" 
              placeholder="Min Price" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Max Price" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button className="btn" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search Inventory'}
            </button>
          </div>

          <div className="card table-container">
            {searchResults.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map(item => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>
                        <span className={`badge badge-${item.category?.toLowerCase()}`}>
                          {item.category}
                        </span>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No results found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {inventoryGrouped.map(supplier => (
            <div key={supplier.supplier_name} className="card supplier-card">
              <div className="supplier-header">
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Truck size={20} color="var(--primary)" />
                    {supplier.supplier_name}
                  </h3>
                </div>
                <div className="total-value">
                  Total Value: ${supplier.total_inventory_value?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.items && supplier.items[0]?.id ? (
                      supplier.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          No items for this supplier
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
