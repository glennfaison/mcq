/**
 * Enum for Roles.
 * @readonly
 * @enum {string}
 */
let Roles = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  DEFAULT: 'DEFAULT'
};

Roles = new Proxy(Roles, {
  get: (target, prop) => {
    if (prop in target) { return target[prop]; }
    throw new Error(`${prop} is not an enumeration on Roles`);
  },
  set: () => {}
});

module.exports = Roles;
