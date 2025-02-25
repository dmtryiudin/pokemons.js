import { useEffect, useState } from "react";

export function usePagination(callback, limit = 20) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [maxCount, setMaxCount] = useState(0);

  const request = async (page) => {
    setIsError(false);

    setIsLoading(true);

    try {
      const data = await callback({ page, limit });

      setData(data.data);
      setMaxPage(data.totalPages);
      setMaxCount(data.totalValuesCount);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    request(currentPage);
  }, [currentPage]);

  const next = () => {
    if (maxPage > 0 || !isLoading || currentPage < maxPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (maxPage > 0 || !isLoading || currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const setPage = (page) => {
    if (maxPage > 0 || !isLoading || page >= 0 || page <= maxPage) {
      setCurrentPage(page);
    }
  };

  return {
    next,
    prev,
    setPage,
    isLoading,
    data,
    isError,
    maxPage,
    currentPage,
    maxCount,
  };
}
