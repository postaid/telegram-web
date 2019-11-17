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
    Store.registerUpdate('authorized', (val) => {
      this.update();
    });

    const url = new URL(window.location.href);

  if (url.searchParams.has('auth')) {
    Store.setStateValue('authorized', false);
  } else {
    const userId = await Storage.get('user_id');
    if (!userId) {
      Store.setStateValue('authorized', false);
    } else {
      const userHash = await Storage.get('user_hash');
      MTProtoClient('users.getFullUser', {
        id: {
          _: 'inputUser',
          user_id: userId,
          access_hash: userHash
        }
      }).then((data) => {
        Store.setStateValue('user', data.user);
        Store.setStateValue('authorized', true);
      }, (err) => {
        if (err.code === 401) {
          url.searchParams.set('auth', '');
          window.location.href = url.toString();
        }
      });
    }
  }
 /*   MTProtoClient('help.getConfig', {})
      .then((date) => {
        debugger;
        // Store.setStateValue('authorized', true);

      }, err => {
        debugger;
        ErrorHandler(err)
      });

 */   console.timeEnd('APP RENDER');
    return el;
  }


  async update () {
    const authorized = Store.getStateValue('authorized');
    if (authorized) {
      document.body.style.backgroundColor = 'rgb(230,235,238)';
      this.showView('chats')
    } else {
      document.body.style.backgroundColor = 'white';
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
