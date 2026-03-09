import React from 'react';
import { Pagination } from 'react-bootstrap';
import './TablePagination.scss';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (pageNumber: number) => void;
  itemName?: string; // e.g., "doctors", "reports"
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  itemName = 'items'
}) => {
  if (totalPages < 1) {
    return null;
  }

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="d-flex justify-content-between align-items-center mt-4 pagination-wrapper">
      <div className="pagination-info">
        Showing {startItem} to {endItem} of {totalElements} {itemName}
      </div>
      <Pagination className='modern-pagination mb-0'>
        <Pagination.First 
          onClick={() => onPageChange(0)} 
          disabled={currentPage === 0}
        />
        <Pagination.Prev 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 0}
        />
        
        {Array.from({length: totalPages}, (_, i) => i)
          .filter(number => {
            // Show first page, last page, current page, and pages around current
            return number === 0 || 
                   number === totalPages - 1 || 
                   (number >= currentPage - 2 && number <= currentPage + 2);
          })
          .map((number, index, array) => {
            // Add ellipsis
            if (index > 0 && number - array[index - 1] > 1) {
              return [
                <Pagination.Ellipsis key={`ellipsis-${number}`} disabled />,
                <Pagination.Item 
                  key={number} 
                  active={number === currentPage} 
                  onClick={() => onPageChange(number)}
                >
                  {number + 1}
                </Pagination.Item>
              ];
            }
            return (
              <Pagination.Item 
                key={number} 
                active={number === currentPage} 
                onClick={() => onPageChange(number)}
              >
                {number + 1}
              </Pagination.Item>
            );
          })}
        
        <Pagination.Next 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages - 1}
        />
        <Pagination.Last 
          onClick={() => onPageChange(totalPages - 1)} 
          disabled={currentPage === totalPages - 1}
        />
      </Pagination>
    </div>
  );
};

export default TablePagination;
