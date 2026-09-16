import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../../redux/store';
export default function SearchBar() {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.properties.filters);
  const handleSearchChange = (e) => {
    dispatch(updateFilters({ search: e.target.value }));
  };
  const handleTypeSelect = (type) => {
    dispatch(updateFilters({ type }));
  };
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e2e8f0'
    }}>
      {/* Category Selection Tab */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', justifyContent: 'center' }}>
        {['all', 'Apartment', 'Villa', 'Plot'].map(category => (
          <button
            key={category}
            onClick={() => handleTypeSelect(category)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              backgroundColor: filters.type === category ? '#0054a6' : '#f1f5f9',
              color: filters.type === category ? '#ffffff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            {category === 'all' ? 'All Types' : category}
          </button>
        ))}
      </div>
      {/* Main Location Input Text Field */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input
            type="text"
            placeholder="Search by locality, city, or project name (e.g. Gachibowli, Whitefield)..."
            value={filters.search}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>
        <button style={{
          backgroundColor: '#0054a6',
          color: '#ffffff',
          border: 'none',
          padding: '0 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>Search</button>
      </div>
    </div>
  );
}
