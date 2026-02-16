import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosDelete = (dataUrl, deleteId) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const deleteDataRequest = async (url, id) => {
      setIsLoading(true);
      try {
        const response = await axios.delete(`${url}/${id}`, {
          signal: controller.signal,
        });

        if (isMounted) {
          console.log("response", response.data);
          setData(response.data);
          setIsError(null);
        }
      } catch (error) {
        if (isMounted) {
          setIsError(error.message);
          setData([]);
        }
      } finally {
        isMounted && setIsLoading(false);
      }

      const cleanUp = () => {
        console.log("clean up function");
        isMounted = false;
        controller.abort();
        console.log("cancelling api request");
      };

      return cleanUp;
    };

    if (deleteId) {
      deleteDataRequest(dataUrl, deleteId);
    }
  }, [dataUrl, deleteId]);

  return { data, isLoading, isError };
};

export default useAxiosDelete;
