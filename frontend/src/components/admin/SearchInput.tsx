import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="w-1/3">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
};

export default SearchInput;