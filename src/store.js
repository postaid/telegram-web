const register = {};
let queue = {};
let updateTimer = null;

const Store = {
  state: {
    locale: 'en-us',
    user: null,
    country: null,
    phone: '+79033529067',
    keepSignIn: true,
    phone_code_hash: '',
    phone_hash_pending: false,
    activeChat: null,
  },
  getStateValue (name) {
    return this.state[name];
  },
  setStateValue (name, val) {
    if (this.state[name] !== val) {
      const old = this.state[name];
      this.state[name] = val;
      this.addToQueue(name, old, val);
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
      updateTimer = setTimeout(() => this.emitUpdate(), 40);
    }
  },
  registerUpdate (names, fn) {
    names = names.split(/\s*,\s*/);
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      if (!register[name]) {
        register[name] = [];
      }
      register[name].push(fn);
    }
  },
  addToQueue (name, old, val) {
    if (!queue[name]) {
      queue[name] = [val, old];
    }
    queue[name][0] = val;
  },
  emitUpdate () {
    Object.entries(queue).forEach(([name, data]) => {
      if (register[name]) {
        const fns = register[name];
        for (let i = 0; i < fns.length; i++) {
          fns[i](data[0], data[1]);
        }
      }
    });
    queue = {};
  }

};

export default Store;
