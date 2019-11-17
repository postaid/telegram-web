import Component from 'ROOT/lib/Component'

import 'ROOT/images/cameraadd_svg.svg';
import Input from 'ROOT/components/controls/Input'
import ImageEditor from 'ROOT/components/ImageEditor'
import ButtonSubmit from 'ROOT/components/controls/ButtonSubmit'
import MTProtoClient from 'ROOT/lib/mtproto'
import Store from 'ROOT/store'
import ErrorHandler from 'ROOT/lib/ErrorHandler'

import MD5 from 'js-md5';

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
    submit.el.classList.add('round');

    let imageBlob = null;
    fileInput.addEventListener('change', (ev) => {
      const file = ev.target.files[0];
      if (file) {
        this.fileName = file.name;
        this.imageEditor_ = new ImageEditor(URL.createObjectURL(file));
        this.el.appendChild(this.imageEditor_.el);
        this.imageEditor_.on('close', () => {
          this.el.removeChild(this.imageEditor_.el);
          this.imageEditor_ = null;
        });
        this.imageEditor_.on('apply', (blob) => {

          this.setImage(URL.createObjectURL(blob));
          imageBlob = blob;
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
          if (imageBlob) {
            this.updateProfilePhoto(imageBlob, this.fileName);
          }
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

  updateProfilePhoto (blob, fileName) {
    this.sendFile(blob)
      .then(({file_id, parts, md5}) => {
        MTProtoClient('photos.uploadProfilePhoto', {
          file: {
            _: 'inputFile',
            id: file_id,
            parts: parts,
            name: fileName,
            md5_checksum: md5
          }
        })
          .then((data) => {
            // save photo for future
          })
          .catch(err => ErrorHandler)
      })
      .catch(err => ErrorHandler(err));
  }

  sendFile (blob) {
    return new Promise(async (resolve, reject) => {
      const file_id = Math.round(Math.random() * 999999999);
      const bytes = await blob.arrayBuffer();
      var hash = MD5.create();
      hash.update(bytes);
      const md5 = hash.hex();
      MTProtoClient('upload.saveFilePart', {
        file_id: file_id, // long 	Random file identifier created by the client
        file_part: 0, // 	int 	Numerical order of a part
        bytes: bytes // 	bytes 	Binary data, contend of a part
      })
        .then((success) => {
          if (success) {
            resolve({file_id, parts: 1, md5});
          }
        })
        .catch((err) => reject(err))
    })
  }
}

export default SignUp;
