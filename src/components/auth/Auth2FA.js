import MTProtoClient from 'ROOT/lib/mtproto';
import Component from 'ROOT/lib/Component';
import Store from 'ROOT/store'
import Input from 'ROOT/components/controls/Input'
import StickerWrapper from 'ROOT/lib/StickerWrapper'
import ErrorHandler from 'ROOT/lib/ErrorHandler'
import ButtonSubmit from 'ROOT/components/controls/ButtonSubmit'
import {
  sha256HashSync,
  nextRandomInt,
  bufferConcat,
  bytesXor,
  bytesFromHex,
  bytesToHex,
  bytesModPow
} from 'telegram-mtproto/lib/bin';

const pbkdf2 = require('pbkdf2');
import { powMod, add, mult, sub, mod, multMod, str2bigInt, bigInt2str } from 'leemon';
import InputPassword from 'ROOT/components/controls/InputPassword'

class Auth2FA extends Component {
  constructor () {
    super();
    this.render();
  }

  render (createEl) {
    let sticker, btnApply, inpCode;
    this.el = createEl('div', 'tg-auth F1S', [
      sticker = createEl('tgs-player', {
        class: 'tg-auth-monkey',
        // src:'./stickers/TwoFactorSetupMonkeyClose.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyCloseAndPeek.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyCloseAndPeekToIdle.tgs',
        src: './stickers/TwoFactorSetupMonkeyIdle.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyPeek.tgs',
        // src:'./stickers/TwoFactorSetupMonkeyTracking.tgs',
        // autoplay: 1,
        // loop: 1
      }),
      createEl('div', 'tg-header', [this.i18n.t('signin_2fa_header')]),
      createEl('div', 'tg-subheader', [
        createEl('div', '', [this.i18n.t('signin_2fa_subheader')]),
        createEl('div', '', [this.i18n.t('signin_2fa_subheader2')])
      ]),
      inpCode = new InputPassword('password_label'),
      btnApply = new ButtonSubmit(this.i18n.t('continue_sign_in_label'))
    ]);

    btnApply.on('action', () => {
      btnApply.showLoader();
      btnApply.setLabel(this.i18n.t('wait_label'))
      this.checkPassword(inpCode.input.value)
        .then((user) => {
          Store.setStateValue('user', user);
          Store.setStateValue('authorized', true);
        })
        .catch(err => {
          debugger;
          btnApply.hideLoader();
          btnApply.setLabel(this.i18n.t('continue_sign_in_label'))
          ErrorHandler(err)
        });
    });
    btnApply.el.style.marginTop = '24px';

    const stickerWrapper = new StickerWrapper(sticker);

    return this.el;
  }

  checkPassword (pwd) {
    return new Promise((resolve, reject) => {
      MTProtoClient('account.getPassword', {})
        .then((data) => {
          const algo = data.current_algo;
          const g = new Uint8Array(256);
          g[255] = algo.g;
          const p = algo.p;
          const password = pwd;
          const salt1 = algo.salt1;
          const salt2 = algo.salt2;
          const g_b = data.srp_B;
          const srp_id = data.srp_id;

          const a = new Uint8Array(256);
          for (let i = 0; i < 256; i++) {
            a[i] = nextRandomInt(255);
          }

          const g_a = bytesModPow(g, a, p); //Math.pow(g, a) mod p;

          const k = this.H(this.Concat(p, g));

          this.PH2(password, salt1, salt2, (x) => {
            const v = bytesModPow(g, x, p);
            const k_v = bytesMultPow(k, v, p);
            const u = this.H(g_a, g_b)
            let __t = bytesSub(g_b, k_v);
            let t = bytesMod(__t, p);
            if (t < 0) {
              t = bytesAdd(t, p);
            }
            const s_a = bytesModPow(t, bytesAdd(a, bytesMult(u, x)), p);
            const k_a = this.H(s_a);

            const M1 = this.H(this.Concat(bytesXor(this.H(p), this.H(g)), this.H2(salt1), this.H2(salt2), g_a, g_b, k_a));

            MTProtoClient('auth.checkPassword', {
              password: {
                _: 'inputCheckPasswordSRP',
                srp_id: srp_id, // long 	SRP ID
                A: g_a, // bytes 	A parameter (see SRP)
                M1: M1 // bytes 	M1 parameter (see SRP)
              }
            })
              .then(({ user }) => resolve(user))
              .catch((err) => reject(err))
          });

        })
        .catch((err) => reject(err));
    });
  }

  H (data) {
    return sha256HashSync(data);
  }

  H2 (data) {
    return this.H(this.H(data));
  }

  SH (data, salt) {
    return this.H(this.Concat(salt, data, salt));
  }

  PH1 (password, salt1, salt2) {
    return this.SH(this.SH(password, salt1), salt2);
  }

  PH2 (password, salt1, salt2, callback) {
    const ph1 = bytesToHex(this.PH1(password, salt1, salt2));
    pbkdf2.pbkdf2(ph1, bytesToHex(salt1), 100000, 256, 'sha512', (err, res) => {
      callback(this.SH(res, salt2));
    });
  }

  Concat (/*args*/) {
    let res = bufferConcat(arguments[0], arguments[1]);
    for (let i = 2; i < arguments.length; i++) {
      res = bufferConcat(res, arguments[i]);
    }
    return res;
  }

  srp () {

  }
}

export default Auth2FA;

function bytesMultPow (x, y, m) {
  var xBigInt = (0, str2bigInt)(bytesToHex(x), 16);
  var yBigInt = (0, str2bigInt)(bytesToHex(y), 16);
  var mBigInt = (0, str2bigInt)(bytesToHex(m), 16);
  var resBigInt = (0, multMod)(xBigInt, yBigInt, mBigInt);

  return bytesFromHex((0, bigInt2str)(resBigInt, 16));
}

function bytesSub (x, y) {
  var xBigInt = (0, str2bigInt)(bytesToHex(x), 16);
  var yBigInt = (0, str2bigInt)(bytesToHex(y), 16);
  var resBigInt = (0, sub)(xBigInt, yBigInt);

  return bytesFromHex((0, bigInt2str)(resBigInt, 16));
}

function bytesAdd (x, y) {
  var xBigInt = (0, str2bigInt)(bytesToHex(x), 16);
  var yBigInt = (0, str2bigInt)(bytesToHex(y), 16);
  var resBigInt = (0, add)(xBigInt, yBigInt);

  return bytesFromHex((0, bigInt2str)(resBigInt, 16));
}

function bytesMod (x, y) {
  var xBigInt = (0, str2bigInt)(bytesToHex(x), 16);
  var yBigInt = (0, str2bigInt)(bytesToHex(y), 16);
  var resBigInt = (0, mod)(xBigInt, yBigInt);

  return bytesFromHex((0, bigInt2str)(resBigInt, 16));
}

function bytesMult (x, y) {
  var xBigInt = (0, str2bigInt)(bytesToHex(x), 16);
  var yBigInt = (0, str2bigInt)(bytesToHex(y), 16);
  var resBigInt = (0, mult)(xBigInt, yBigInt);

  return bytesFromHex((0, bigInt2str)(resBigInt, 16));
}
