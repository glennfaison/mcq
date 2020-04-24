/**
 *  @class GenericCrudService
 *  Generic CRUD service
 */
class GenericCrudService {
  constructor (dao) {
    /** @type {Model} */
    this.dao = dao;
  }

  /**
   *  Save a document to the database. MyModel.create(docs) calls new MyModel(doc).save().
   *  Triggers the save() hook.
   *  @memberof GenericCrudService
   *  @param {any} properties
   *  @returns {Promise<MongooseDocument>}
   */
  create (properties) {
    return this.dao.create(properties);
  }

  /**
   *  Finds a single document by its _id field.
   *  findById(id) is almost* equivalent to findOne({ _id: id }).
   *  findById() triggers findOne hooks.
   *  @memberof GenericCrudService
   *  @param {string} id value of _id to query by
   *  @param {any} [projection] optional fields to return
   *  @returns {Promise<MongooseDocument>}
   */
  findById (id, projection) {
    return this.dao.findById(id, projection);
  }

  /**
   *  Finds one document. The conditions are cast to their respective SchemaTypes
   *  before the command is sent.
   *  @memberof GenericCrudService
   *  @param {any} conditions
   *  @param {any} [projection] optional fields to return
   *  @returns {Promise<MongooseDocument>}
   */
  findOne (conditions, projection) {
    return this.dao.findOne(conditions, projection);
  }

  /**
   *  Returns true if at least one document exists in the database that
   *  matches the given `conditions`, and false otherwise.
   *  @memberof GenericCrudService
   *  @param {any} conditions
   *  @returns {Promise<boolean>}
   */
  exists (conditions) {
    return this.dao.exists(conditions);
  }

  /**
   *  Finds documents.
   * @memberof GenericCrudService
   * @param {any} conditions
   * @param {any} [projection] optional fields to return
   * @returns {Promise<MongooseDocument[]>} an array of documents
   */
  find (conditions, projection) {
    return this.dao.find(conditions, projection);
  }

  /**
   *  Find a document by id, and update it with `properties`.
   *  @memberof GenericCrudService
   *  @param {string} id value of _id to query by
   *  @param {any} properties
   *  @returns {Promise<MongooseDocument>} the updated document
   */
  async findByIdAndUpdate (id, properties) {
    delete properties.id;
    delete properties._id;
    try {
      return this.dao.findByIdAndUpdate(id, properties, { new: true });
    } catch (e) { return null; }
  }

  /**
   *  Find a document matching the `conditions`, and update it with `properties`.
   *  @memberof GenericCrudService
   *  @param {string} conditions values to query by
   *  @param {any} [properties]
   *  @returns {Promise<MongooseDocument>} the updated document
   */
  findOneAndUpdate (conditions, properties) {
    delete properties.id;
    delete properties._id;
    try {
      return this.dao.findOneAndUpdate(conditions, properties, { new: true });
    } catch (e) { return null; }
  }

  /**
   *  Find a document by id, and delete it.
   *  @memberof GenericCrudService
   *  @param {string} id value of _id to query by
   *  @returns {Promise<MongooseDocument>} the deleted document
   */
  findByIdAndDelete (id) {
    return this.dao.findByIdAndDelete(id);
  }

  /**
   *  Find a document matching the `conditions`, and delete it.
   *  @memberof GenericCrudService
   *  @param {string} conditions values to query by
   *  @returns {Promise<MongooseDocument>} the deleted document
   */
  findOneAndDelete (conditions) {
    return this.dao.findOneAndDelete(conditions);
  }
}

/** @typedef {import('mongoose').Model} Model */
/** @typedef {import('mongoose').MongooseDocument} MongooseDocument */

module.exports = GenericCrudService;
