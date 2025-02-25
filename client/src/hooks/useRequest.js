import { useState } from "react";

export function useRequest(callback) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const request = async (params) => {
    setError("");
    setIsError(false);

    try {
      setIsLoading(true);
      const response = await callback(params);
      setData(response);
    } catch (e) {
      setError(e.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setIsError(false);
    setError(null);
  };

  return { data, isError, isLoading, error, request, resetError };
}
