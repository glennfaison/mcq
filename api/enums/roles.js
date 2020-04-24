/**
 *  Enum for Roles.
 *  @readonly
 *  @enum {string}
 */
let Roles = {
  /** @type {Roles} */
  ADMINISTRATOR: 'ADMINISTRATOR',
  /** @type {Roles} */
  DEFAULT: 'DEFAULT'
};

Roles = new Proxy(Roles, {
  get: (target, prop) => {
    if (prop in target) { return target[prop]; }
    throw new Error(`${prop} is not an enumeration on Roles`);
  },
  set: () => {}
});

/** @typedef {'ADMINISTRATOR'|'DEFAULT'} Roles */

module.exports = Roles;
