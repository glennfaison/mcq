/**
 *  Create a CRUD Service from a Mongoose Model
 */
function mixin (target, addOn) {
  const mixed = new Proxy(target, {
    get: (target, prop) => {
      if (prop in addOn) { return addOn[prop]; }
      return target[prop];
    }
  });
  return mixed;
}

module.exports = mixin;
