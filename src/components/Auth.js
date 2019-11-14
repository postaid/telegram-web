import Component from 'ROOT/lib/Component'
import ViewSwitcher from 'ROOT/lib/ViewSwitcher'
import SignIn from 'ROOT/components/SignIn'
import AuthCode from 'ROOT/components/AuthCode'
import SignUp from 'ROOT/components/SignUp'
import Store from 'ROOT/store'

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
      { name: 'signup', c: SignUp}
    ], placeholder);

    Store.registerUpdate('phone, phoneCodeHash, signUpRequired', () => this.update());

    this.update();
  }

  update () {
    const userPhone = Store.getStateValue('phone');
    const userPhoneHash = Store.getStateValue('phoneCodeHash');
    const userSignUp = Store.getStateValue('signUpRequired');
    if (1 || userSignUp) {
      this.vs_.showView('signup');
    } else if (userPhone && userPhoneHash) {
      this.vs_.showView('code');
    } else {
      this.vs_.showView('signin');
    }
  }

}

export default Auth;
