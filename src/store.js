const register = {};

const Store = {
  state: {
    locale: 'en-us',
    user: null,
    country: null,
    phone: '+79033529067',
    keepSignIn: true,
    phone_code_hash: '',
    phone_hash_pending: false,
  },
  getStateValue (name) {
    return this.state[name];
  },
  setStateValue (name, val) {
    if (this.state[name] !== val) {
      const old = this.state[name];
      this.state[name] = val;
      this.emitUpdate(name, old, val);
    }
    console.log('STATE', this.state);
  },
  registerUpdate (name, fn) {
    if (!register[name]) {
      register[name] = [];
    }
    register[name].push(fn);
  },
  emitUpdate (name, old, val) {
    if (register[name]) {
      const fns = register[name];
      for (let i = 0; i < fns.length; i++) {
        fns[i](val, old);
      }
    }
  }

};

export default Store;
