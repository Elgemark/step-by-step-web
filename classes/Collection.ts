import _ from "lodash";

export interface CollectionItem {
  id: string;
  [key: string]: any;
}

export default class Collection {
  _collection: Array<CollectionItem>;
  _prevDeps: Array<any>;

  constructor() {
    this._collection = [];
  }

  union(items: Array<CollectionItem>, deps: Array<any>, onReset?: Function): Array<CollectionItem> {
    if (_.isEqual(deps, this._prevDeps)) {
      this._collection = _.unionBy(this._collection, items, "id");
    } else {
      this._collection = items;
      this._prevDeps = deps;
      onReset && onReset();
    }

    return this._collection;
  }
}
