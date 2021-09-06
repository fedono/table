import * as React from 'react';
import {DataIndex, Key} from '../interface';

const INTERNAL_KEY_PREFIX = 'RC_TABLE_KEY';

function toArray<T>(arr: T | readonly T[]): T[] {
  if (arr === undefined || arr === null) {
    return [];
  }

  return (Array.isArray(arr) ? arr : [arr]) as T[];
}

export function getPathValue<ValueType, ObjectType extends object>(
  record: ObjectType,
  path: DataIndex
): ValueType {
  if (!path && typeof path !== 'number') {
    return (record as unknown) as ValueType;
  }

  const pathList = toArray(path);

  let current: ValueType | ObjectType = record;
  for (let i = 0; i < pathList.length; i++) {
    if (!current) {
      return null;
    }

    const prop = pathList[i];
    current = current[prop];
  }

  return current as ValueType;
}

export function mergeObject<ReturnObject extends object> (
  ...objects: Partial<ReturnObject>[]
): ReturnObject {
  const merged: Partial<ReturnObject> = {};

  function fillProps(obj: object, clone: object) {
    if (clone) {
      Object.keys(clone).forEach(key => {
        const value = clone[key];
        if (value && typeof value === 'object') {
          obj[key] = obj[key] || {};
          fillProps(obj[key], value);
        } else {
          obj[key] = value;
        }
      })
    }
  }

  objects.forEach(clone => {
    fillProps(merged, clone);
  });

  return merged as ReturnObject;
}

interface GetColumnKeyColumn {
  key?: Key;
  dataIndex?: DataIndex;
}

export function getColumnsKey(columns: readonly GetColumnKeyColumn[]) {
  const columnKeys: React.Keys[] = [];
  const keys: Record<React.Key, boolean> = {};

  columns.forEach(column => {
    const {key, dataIndex} = column || {};
    let mergedKey = key || toArray(dataIndex).join('-') || INTERNAL_KEY_PREFIX;
    while (keys[mergedKey]) {
      mergedKey = `${mergedKey}_next`;
    }
    keys[mergedKey] = true;
    columnKeys.push(mergedKey);
  });

  return columnKeys;
}

export function validateValue<T>(val: T) {
  return val !== null && val !== undefined;
}