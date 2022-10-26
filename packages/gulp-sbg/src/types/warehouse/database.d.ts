export = Database;

interface DatabaseOptions {
  /**
   * Database version
   * * default 0
   */
  version: number;
  path: string;
  onUpgrade: CallableFunction;
  onDowngrade: CallableFunction;
}

declare class Database {
  /**
   * Database constructor.
   *
   * @param {object} [options]
   *   @param {number} [options.version=0] Database version
   *   @param {string} [options.path] Database path
   *   @param {function} [options.onUpgrade] Triggered when the database is upgraded
   *   @param {function} [options.onDowngrade] Triggered when the database is downgraded
   */
  constructor(data: object);

  /**
   * Creates a new model.
   *
   * @param {string} name
   * @param {Schema|object} [schema]
   * @return {Model}
   */
  model(name: string, schema?: Schema | object): Model;
  /**
   * Loads database.
   *
   * @param {function} [callback]
   * @return {Promise}
   */
  load(callback?: CallableFunction): Promise<any>;
  /**
   * Saves database.
   *
   * @param {function} [callback]
   * @return {Promise}
   */
  save(callback?: CallableFunction): Promise<any>;
  toJSON(): {
    meta: {
      version: any;
      warehouse: any;
    };
    models: {};
  };
  Schema: typeof Schema;
  SchemaType: typeof SchemaType;
}
declare namespace Database {
  import Schema_1 = Database.Schema;
  export { Schema_1 as Schema };
  import SchemaType_1 = Database.SchemaType;
  export { SchemaType_1 as SchemaType };
  export const version: any;
}
import Schema = require('./schema');
import Model = require('./model');
import SchemaType = require('./schematype');
//# sourceMappingURL=database.d.ts.map
