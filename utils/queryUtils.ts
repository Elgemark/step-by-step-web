import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface Query {
  [key: string]: any;
}

export interface QueryProperties {
  debounceWait?: number;
}

const debouncedSetQuery = (wait = 1000) =>
  _.debounce((router, query) => {
    const newQuery = _.pickBy(query, _.identity);
    router.replace({ pathname: router.asPath.split("?")[0], query: newQuery });
  }, wait);

export const useDebouncedQuery = (query = {}, props: QueryProperties = {}) => {
  const queryProps: QueryProperties = { debounceWait: 100, ...props };
  const debounce = debouncedSetQuery(queryProps.debounceWait);
  const router = useRouter();
  const [_query, setQuery] = useState<Query>(query);

  useEffect(() => {
    setQuery({ ...getQuery(), ..._query });
  }, []);

  return {
    set: (query) => {
      const newQuery = { ..._query, ...query };
      setQuery(newQuery);
      debounce(router, newQuery);
    },
    get: () => {
      return _query;
    },
    query: _query,
  };
};

export const getQuery = () => {
  return Object.fromEntries(new URLSearchParams(location.search));
};

export const getPath = () => {
  return location.href;
};

export const getBasePath = () => {
  return location.href.split("?")[0];
};
