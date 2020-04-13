/**
 *  @class GenericCrudService
 *  Generic CRUD service
 */
class GenericCrudService {
  constructor (model) {
    /** @type {Model} */
    this.model = model;
  }

  /**
   *  Save a document to the database. MyModel.create(docs) calls new MyModel(doc).save().
   *  Triggers the save() hook.
   *  @memberof GenericCrudService
   *  @param {any} properties
   *  @returns {Model}
   */
  create (properties) {
    return this.model.create(properties);
  }

  /**
   *  Finds a single document by its _id field.
   *  findById(id) is almost* equivalent to findOne({ _id: id }).
   *  findById() triggers findOne hooks.
   *  @memberof GenericCrudService
   *  @param {string} id value of _id to query by
   *  @param {any} projection optional fields to return
   *  @returns {Model}
   */
  findById (id, projection) {
    return this.model.findById(id, projection);
  }

  /**
   *  Finds one document. The conditions are cast to their respective SchemaTypes
   *  before the command is sent.
   *  @memberof GenericCrudService
   *  @param {any} conditions
   *  @param {any} projection optional fields to return
   *  @returns {Model}
   */
  findOne (conditions, projection) {
    return this.model.findOne(conditions, projection);
  }

  /**
   *  Returns true if at least one document exists in the database that
   *  matches the given `conditions`, and false otherwise.
   *  @memberof GenericCrudService
   *  @param {any} conditions
   *  @returns {Promise<boolean>}
   */
  exists (conditions) {
    return this.model.exists(conditions);
  }

  /**
   *  Finds documents.
   * @memberof GenericCrudService
   * @param {any} conditions
   * @param {any} projection optional fields to return
   * @returns {Promise<Model[]>} an array of documents
   */
  find (conditions, projection) {
    return this.model.find(conditions, projection);
  }

  /**
   *  Find a document by id, and update it with `properties`.
   *  @memberof GenericCrudService
   *  @param {string} id value of _id to query by
   *  @param {any} properties
   *  @returns {Promise<Model>} the updated document
   */
  findByIdAndUpdate (id, properties) {
    return this.model.findByIdAndUpdate(id, properties, { new: true });
  }

  /**
   *  Find a document matching the `conditions`, and update it with `properties`.
   *  @memberof GenericCrudService
   *  @param {string} conditions values to query by
   *  @param {any} properties
   *  @returns {Promise<Model>} the updated document
   */
  findOneAndUpdate (conditions, properties) {
    return this.model.findOneAndUpdate(conditions, properties, { new: true });
  }

  /**
   *  Find a document by id, and delete it.
   *  @memberof GenericCrudService
   *  @param {string} id value of _id to query by
   *  @returns {Promise<Model>} the deleted document
   */
  findByIdAndDelete (id) {
    return this.model.findByIdAndDelete(id);
  }

  /**
   *  Find a document matching the `conditions`, and delete it.
   *  @memberof GenericCrudService
   *  @param {string} conditions values to query by
   *  @returns {Promise<Model>} the deleted document
   */
  findOneAndDelete (conditions) {
    return this.model.findOneAndDelete(conditions);
  }
}

/** @typedef {import('mongoose').Model} Model */

module.exports = GenericCrudService;
