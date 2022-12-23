import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";

interface Query {
  [key: string]: any;
}

const debouncedSetQuery = _.debounce((router, query) => {
  router.replace({ query: _.omitBy({ ...router.query, ...query }, _.isEmpty) });
}, 500);

export const useDebouncedQuery = () => {
  const router = useRouter();
  const [query, setQuery] = useState<Query>({});

  return {
    set: (query) => {
      setQuery(query);
      debouncedSetQuery(router, query);
    },
    get: () => {
      return router.query;
    },
    query,
  };
};
