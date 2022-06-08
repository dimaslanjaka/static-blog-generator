import { DynamicObject } from '../types';

export const sortedObject = <T extends DynamicObject>(data: T) =>
  Object.fromEntries(Object.entries(data).sort()) as T;
