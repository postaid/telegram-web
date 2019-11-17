import MTProtoClient from 'ROOT/lib/mtproto';
import Component from 'ROOT/lib/Component';
import Store from 'ROOT/store'
import Button from 'ROOT/components/controls/Button'
import IconEdit from 'ROOT/components/icons/IconEdit'
import Input from 'ROOT/components/controls/Input'
import StickerWrapper from 'ROOT/lib/StickerWrapper'
import Storage from 'ROOT/lib/Storage'
import ErrorHandler from 'ROOT/lib/ErrorHandler'
import Config from 'ROOT/config'

class AuthCode extends Component {
  constructor() {
    super();
    this.render();
  }

  render (createEl) {
    let sticker, btnEdit, inpCode;
    let phone = this.reformatPhone(Store.getStateValue('phone'));
    this.el = createEl('div', 'tg-auth', [
      sticker = createEl('tgs-player', {
        class: 'tg-auth-monkey',
        // src:'./stickers/TwoFactorSetupMonkeyClose.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyCloseAndPeek.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyCloseAndPeekToIdle.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyIdle.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyPeek.tgs',
        src:'./stickers/TwoFactorSetupMonkeyTracking.tgs',
        // autoplay: 1,
        // loop: 1
      }),
      createEl('div', 'tg-header tg-auth-code-phone', [
        phone,
        btnEdit = new Button('')
      ]),
      createEl('div', 'tg-subheader', [
        createEl('div', '', [this.i18n.t('wait_for_sms_code')]),
        createEl('div', '', [this.i18n.t('wait_for_sms_code2')])
      ]),
      inpCode = new Input('sms_code_label')
    ]);
    let iconEdit = new IconEdit();
    btnEdit.el.classList.add('tg-button-nofill');
    btnEdit.el.appendChild(iconEdit.el);

    const stickerWrapper = new StickerWrapper(sticker);

    btnEdit.on('action', () => {
      Store.setStateValue('phoneCodeHash', '');
    });
    inpCode.on('input', (value) => {
      if (value.length === 5 ) {
        MTProtoClient('auth.signIn', {
          phone_number   : Store.getStateValue('phone').replace(/[^0-9+]/g, ''),
          phone_code_hash: Store.getStateValue('phoneCodeHash'),
          phone_code     : value
        }, {dcID: 2})
          .then((data) => {
            inpCode.el.classList.remove('error');
            if (data._ === 'auth.authorizationSignUpRequired') {
              Store.setStateValue('signUpRequired', true);
            } else {
              window.history.replaceState({}, '', '/');
              Store.setStateValue('user', data.user);
              Store.setStateValue('authorized', true);
              Storage.set('user_id', data.user.id);
              Storage.set('user_hash', data.user.access_hash);
            }
          })
          .catch((err) => {
            if (err.type === 'PHONE_CODE_INVALID') {
              inpCode.el.classList.add('error');
            } else if (err.type === 'PHONE_CODE_EXPIRED') {
              ErrorHandler(err);
            } else {
              ErrorHandler(err);
            }
            return err;
          });
      }
    });
    let prevValue = '';
    const trackDownTime = 150;
    const charTrackTime = 5;
    inpCode.on('input', (value, ev) => {
      sticker.setSpeed(2);
      const ln = value.length;
      if (ln > 10) {
        inpCode.input.value = value.slice(0, 10);
        return;
      }
      const prevLn = prevValue.length;
      if (value) {
        let time = 0;
        if (prevLn < ln) {
          sticker.setDirection(1);
          if (prevValue === '') {
            time = trackDownTime;
          }
          time += ln * charTrackTime;
        } else {
          sticker.setDirection(-1);
          if (value === '') {
            time = trackDownTime + 200;
          }
          time += prevLn * charTrackTime;
        }
        stickerWrapper.playFor(time);
      } else {
        sticker.setDirection(-1);
        sticker.play();
      }
      prevValue = value;
    });

    return this.el;
  }

  reformatPhone (phone) {
    phone = phone.replace(/\s+/g, '');
    const match = phone.match(/\d/g);

    if (match) {
      const nums = match.length;
      const diff = nums - 10;
      return phone.slice(0, diff + 1) + ' ' + phone.slice(diff + 1);
    }
  }
}

export default AuthCode;
