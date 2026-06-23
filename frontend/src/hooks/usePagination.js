import { useCallback, useState } from "react";

const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);
  const nextPage = useCallback(
    (totalPages) => setPage((current) => Math.min(current + 1, totalPages)),
    []
  );
  const previousPage = useCallback(
    () => setPage((current) => Math.max(current - 1, 1)),
    []
  );

  return { page, setPage, nextPage, previousPage };
};

export default usePagination;
