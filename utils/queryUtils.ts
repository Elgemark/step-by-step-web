import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";

export interface Query {
  [key: string]: any;
}

const debouncedSetQuery = _.debounce((router, query) => {
  router.replace({ query: _.omitBy({ ...router.query, ...query }, _.isEmpty) });
}, 1000);

export const useDebouncedQuery = (query = {}) => {
  const router = useRouter();
  const [_query, setQuery] = useState<Query>(query);

  return {
    set: (query) => {
      setQuery(query);
      debouncedSetQuery(router, query);
    },
    get: () => {
      return router.query;
    },
    query: _query,
  };
};
