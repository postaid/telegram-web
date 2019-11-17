import Component from 'ROOT/lib/Component'
import ViewSwitcher from 'ROOT/lib/ViewSwitcher'
import SignIn from 'ROOT/components/auth/SignIn'
import AuthCode from 'ROOT/components/auth/AuthCode'
import SignUp from 'ROOT/components/auth/SignUp'
import Store from 'ROOT/store'
import Auth2FA from 'ROOT/components/auth/Auth2FA'

class Auth extends Component {
  constructor () {
    super();
    this.render();
  }

  render (createEl) {
    let placeholder;
    this.el = createEl('div', 'tg-auth', [
      placeholder = Component.createVoid()
    ]);
    this.vs_ = new ViewSwitcher([
      { name: 'signin', c: SignIn},
      { name: 'code', c: AuthCode},
      { name: 'sesspwd', c: Auth2FA},
      { name: 'signup', c: SignUp}
    ], placeholder);

    Store.registerUpdate('phone, phoneCodeHash, signUpRequired, sessPwdNeeded', () => this.update());

    this.update();
  }

  update () {
    const userPhone = Store.getStateValue('phone');
    const userPhoneHash = Store.getStateValue('phoneCodeHash');
    const userSignUp = Store.getStateValue('signUpRequired');
    const sessPwdNeeded = Store.getStateValue('sessPwdNeeded');
    if (userSignUp) {
      this.vs_.showView('signup');
    } else if (sessPwdNeeded) {
      this.vs_.showView('sesspwd')
    } else if (userPhone && userPhoneHash) {
      this.vs_.showView('code');
    } else {
      this.vs_.showView('signin');
    }
  }

  beforeShow () {
    document.body.style.backgroundColor = 'white';
  }

}

export default Auth;
