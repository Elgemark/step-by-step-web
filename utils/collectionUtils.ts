import { useState } from "react";
import _ from "lodash";

export interface CollectionItem {
  id: string;
  [key: string]: any;
}

export type Collection = Array<CollectionItem>;

export const useCollection = (collection: Collection = []) => {
  const [_collection, _setCollection] = useState(collection);

  return {
    collection: _collection,
    addItem: (item: CollectionItem) => {
      const newCollection = _.unionBy(_collection, [item]);
      _setCollection(newCollection);
    },
    addItems: (items: Collection) => {
      const newCollection = _.unionBy(_collection, items);
      _setCollection(newCollection);
    },
  };
};
