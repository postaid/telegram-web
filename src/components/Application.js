import Component from "ROOT/lib/Component";

import Auth from "ROOT/components/Auth";
import AuthCode from 'ROOT/components/AuthCode';
import ChatsList from 'ROOT/components/ChatsList'
import Store from "ROOT/store";
import Storage from 'ROOT/lib/Storage';
import MTProtoClient from "ROOT/lib/mtproto";
import ErrorHandler from 'ROOT/lib/ErrorHandler'

class Application extends Component {
  constructor () {
    super();
    this.views_ = [
      { name: 'auth', c: Auth, e: null },
      { name: 'code', c: AuthCode, e: null },
      { name: 'chats', c: ChatsList, e: null },
    ];
    this.render();
  }

  async render () {
    console.time('APP RENDER');
    const el = this.el = document.createElement('div');
    el.className = 'tg-app';
    this.el = el;

    Store.registerUpdate('user', () => {
      this.update();
    });
    /*
        Store.registerUpdate('phone_code_hash', () => {
          this.update();
        });
        Store.registerUpdate('phone_hash_pending', (val) => {
          if (val) {
            const view = this.getView('code');
            if (view && !view.e) {
              view.e = new view.c();
            }
          }
        });
    */
    Store.registerUpdate('authorized', (val) => {
      this.update();
    });
    this.update();

    /*
        const dc = await Storage.get('dc');
        if (dc) {
          const authKey = await Storage.get(`dc${dc}_auth_key`);
          if (authKey) {
            Store.setStateValue('authorized', true);
            this.showView('chats');
          }
        }
    */
    MTProtoClient('help.getNearestDc', {})
      .then(() => {
      })
      .catch(err => ErrorHandler(err));

    console.timeEnd('APP RENDER');
    return el;
  }

  async update () {
    const authorized = Store.getStateValue('authorized');
    if (authorized) {
      this.showView('chats')
    } else {
      this.showView('auth');
      /*
            const user = Store.getStateValue('user');
            const phone_code_hash = Store.getStateValue('phone_code_hash');
            if (!user && !phone_code_hash) {
              this.showView('auth');
            } else if (!user && phone_code_hash) {
              this.showView('code');
            } else {
              this.showView('chats');
            }
      */
    }
  }

  getView (name) {
    return this.views_.find(v => v.name === name);
  }

  showView (name) {
    for (let i = 0; i < this.views_.length; i++) {
      const view = this.views_[i];
      if (view.name === name) {
        if (!view.e) {
          view.e = new view.c();
        }
        this.el.appendChild(view.e.el);
      } else if (view.e && view.e.el.parentNode) {
        view.e.el.parentNode.removeChild(view.e.el);
      }
    }
  }

  getChildren (name) {

  }
}


export default Application;
