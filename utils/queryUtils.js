import _ from "lodash";
import { useRouter } from "next/router";

export const useDebouncedQuery = (debounceWait = 500) => {
  const router = useRouter();

  const debouncedSetQuery = _.debounce((query) => {
    router.replace({ query: { ...router.query, ...query } });
  }, debounceWait);

  return {
    set: (query) => debouncedSetQuery(query),
    get: () => {
      router.query;
    },
  };
};
