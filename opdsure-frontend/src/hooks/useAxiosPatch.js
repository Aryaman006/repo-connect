import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosPatch = (dataUrl, patchData) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const patchDataRequest = async (url, data) => {
      setIsLoading(true);
      try {
        const response = await axios.patch(url, data, {
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

    if (patchData) {
      patchDataRequest(dataUrl, patchData);
    }
  }, [dataUrl, patchData]);

  return { data, isLoading, isError };
};

export default useAxiosPatch;
