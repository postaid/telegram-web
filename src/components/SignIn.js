import MTProtoClient from 'ROOT/lib/mtproto';
import Component from 'ROOT/lib/Component';
import Store from 'ROOT/store';

import CountrySelect from 'ROOT/components/controls/CountrySelect';
import InputPhone from 'ROOT/components/controls/InputPhone'
import Checkbox from 'ROOT/components/controls/Checkbox'
import Button from 'ROOT/components/controls/Button'
import Config from 'ROOT/config'

const createEl = Component.createElement;

class SignIn extends Component {
  constructor () {
    super();
    this.btnNext_ = null;
    this.render();
  }

  render () {
    let header, cbKeepSignIn, inputPhone;
    this.el = createEl('div', 'tg-signin', [
      createEl('div', 'tg-logo'),
      header = createEl('div', 'tg-header', [this.i18n.t('auth_header')]),
      createEl('div', 'tg-subheader', [
        createEl('div', '', [this.i18n.t('auth_subheader')]),
        createEl('div', '', [this.i18n.t('auth_subheader2')])
      ]),
      new CountrySelect('country_select_label'),
      new InputPhone('phone_number_label'),
      cbKeepSignIn = new Checkbox('keep_sign_in_label'),
      this.btnNext_ = new Button('', 'continue_sign_in_label')
    ]);
    cbKeepSignIn.el.style.marginTop = '11px';
    this.btnNext_.el.classList.add('tg-button-submit');

    header.addEventListener('click', () => {
      Store.setStateValue('locale', 'ru-ru');
    });

    cbKeepSignIn.setValue(Store.getStateValue('keepSignIn'));
    cbKeepSignIn.on('change', (value) => {
      Store.setStateValue('keepSignIn', value);
    });

    this.btnNext_.on('action', () => {
      MTProtoClient('auth.sendCode', {
        phone_number  : Store.getStateValue('phone'),
        current_number: false,
        api_id        : Config.app.id,
        api_hash      : Config.app.hash,
        settings      : {
          _: 'codeSettings',
          flags: 0,
          allow_flashcall: true,
          current_number: true,
          allow_app_hash: true,
        },
      }).then((data) => {
        Store.setStateValue('phoneCodeHash', data.phone_code_hash);
      }, (error) => {
        console.error(error);
      })
    });

    Store.registerUpdate('phone', (phone) => {
      this.updatePhone_(phone);
    });

    this.updatePhone_('');

    return this.el;
  }

  updatePhone_ (phone) {
    phone = phone.replace(/^\s+/, '').replace(/\s+$/, '');
    const country = Store.getStateValue('country');
    if (phone && (!country || country[2] !== phone)) {
      this.btnNext_.el.style.display = '';
    } else {
      this.btnNext_.el.style.display = 'none';
    }
  }


}

export default SignIn;
