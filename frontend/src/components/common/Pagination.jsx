// export default function Pagination({ currentPage, totalPages, onPageChange }) {
//   if (totalPages <= 1) return null

//   return (
//     <div className="flex items-center gap-1 mt-2">
//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`w-7 h-7 rounded-md text-xs font-medium transition
//             ${currentPage === page
//               ? "bg-gray-900 text-white"
//               : "text-gray-500 hover:bg-gray-100"
//             }`}
//         >
//           {page}
//         </button>
//       ))}
//     </div>
//   )
// }
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];

  pages.push(1);

  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="
        px-2
        py-1
        text-xs
        border
        rounded
        disabled:opacity-50
        "
      >
        Prev
      </button>

      {uniquePages.map((page, index) => {
        const previous = uniquePages[index - 1];

        const showDots = previous && page - previous > 1;

        return (
          <div key={page} className="flex items-center gap-1">
            {showDots && <span>...</span>}

            <button
              onClick={() => onPageChange(page)}
              className={`
                  w-7
                  h-7
                  rounded-md
                  text-xs
                  font-medium
                  transition
                  ${
                    currentPage === page
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                  `}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="
        px-2
        py-1
        text-xs
        border
        rounded
        disabled:opacity-50
        "
      >
        Next
      </button>
    </div>
  );
}
