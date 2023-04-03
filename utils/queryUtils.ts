export const getQuery = () => {
  return Object.fromEntries(new URLSearchParams(location.search));
};

export const getPath = () => {
  return location.href;
};

export const getBasePath = () => {
  return location.href.split("?")[0];
};
