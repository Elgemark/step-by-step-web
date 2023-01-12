import { useEffect, useState } from "react";
import _ from "lodash";

export interface CollectionItem {
  id: string;
  [key: string]: any;
}

export type Collection = Array<CollectionItem>;

export const useCollection = (collection: Collection = []) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [_collection, _setCollection] = useState(collection);

  useEffect(() => {
    if (!isFirstRender) {
      const newCollection = _.unionBy(_collection, collection, "id");
      _setCollection(newCollection);
    }
    setIsFirstRender(false);
  }, collection);

  return {
    collection: _collection,
    addItem: (item: CollectionItem) => {
      const newCollection = _.unionBy(_collection, [item], "id");
      _setCollection(newCollection);
      return newCollection;
    },
    addItems: (items: Collection) => {
      const newCollection = _.unionBy(_collection, items, "id");
      _setCollection(newCollection);
      return newCollection;
    },
    reset: () => {
      _setCollection([]);
    },
  };
};
