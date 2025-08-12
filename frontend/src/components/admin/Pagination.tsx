import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-l disabled:opacity-50 hover:bg-gray-400"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-4 py-2 ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-gray-400`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-r disabled:opacity-50 hover:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;