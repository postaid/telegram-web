import Component from 'ROOT/lib/Component'

import 'ROOT/images/cameraadd_svg.svg';
import Input from 'ROOT/components/controls/Input'
import ImageEditor from 'ROOT/components/ImageEditor'
import ButtonSubmit from 'ROOT/components/controls/ButtonSubmit'
import MTProtoClient from 'ROOT/lib/mtproto'
import Store from 'ROOT/store'
import ErrorHandler from 'ROOT/lib/ErrorHandler'

class SignUp extends Component {
  constructor () {
    super();
    this.imageEditor_ = null;
    this.render();
  }

  render (createEl) {
    let inputName, inputLastName, addImage, fileInput, submit;
    this.el = createEl('div', 'tg-signup', [
      this.addImage = createEl('label', 'tg-logo', [
        fileInput = createEl('input', {class: 'tg-image-editor-file', type: 'file'}),
        createEl('div', 'tg-logo add-photo')
      ]),
      createEl('div', 'tg-header', [this.i18n.t('signup_header')]),
      createEl('div', 'tg-subheader', [
        createEl('div', '', [this.i18n.t('signup_subheader')]),
        createEl('div', '', [this.i18n.t('signup_subheader2')])
      ]),
      inputName = new Input('name_label'),
      inputLastName = new Input('last_name_label'),
      submit = new ButtonSubmit('' ,this.i18n.t('signin_submit_label'))
    ]);

    fileInput.addEventListener('change', (ev) => {
      const file = ev.target.files[0];
      if (file) {
        this.imageEditor_ = new ImageEditor(URL.createObjectURL(file));
        this.el.appendChild(this.imageEditor_.el);
        this.imageEditor_.on('close', () => {
          this.el.removeChild(this.imageEditor_.el);
          this.imageEditor_ = null;
        });
        this.imageEditor_.on('apply', (url) => {
          this.setImage(url);
          this.el.classList.add('has-photo');
          this.el.removeChild(this.imageEditor_.el);
          this.imageEditor_ = null;
        });
        fileInput.value = '';
      }
    });

    submit.on('action', () => {
      submit.showLoader();
      submit.setLabel(this.i18n.t('wait_label'));

      MTProtoClient('auth.signUp', {
        phone_number: Store.getStateValue('phone'),
        phone_code_hash: Store.getStateValue('phoneCodeHash'),
        first_name: inputName.input.value,
        last_name: inputLastName.input.value,
      })
        .then(({user}) => {
          Store.setStateValue('user', user);
          Store.setStateValue('authorized', true);
        })
        .catch((err) => {
          submit.hideLoader();
          submit.setLabel(this.i18n.t('signin_submit_label'));
          ErrorHandler(err);
        });
    });
  }

  setImage (url) {
    this.selectedImage_ = url;
    if (url) {
      this.addImage.style.backgroundImage = `url(${url})`;
      this.addImage.style.backgroundSize = 'cover';
    } else {
      this.addImage.style.backgroundImage = '';
      this.addImage.style.backgroundSize = '';
    }
  }
}

export default SignUp;
