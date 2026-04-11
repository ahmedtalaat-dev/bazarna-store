"use client";

import React from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex justify-center gap-2 mt-10">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Go to previous page"
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/* Pages */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNumber = i + 1;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            aria-current={page === pageNumber ? "page" : undefined}
            className={`px-3 py-1 border rounded ${
              page === pageNumber ? "bg-blue-500 text-white" : ""
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Go to next page"
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}