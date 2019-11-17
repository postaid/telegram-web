import Component from 'ROOT/lib/Component'
import IconClose from 'ROOT/components/icons/IconClose'
import Button from 'ROOT/components/controls/Button'
import ButtonSubmit from 'ROOT/components/controls/ButtonSubmit'
import IconCheck from 'ROOT/components/icons/IconCheck'

class ImageEditor extends Component {
  constructor (imageUrl) {
    super();
    this.url_ = imageUrl;
    this.mDragStart_ = this.dragStart.bind(this);
    this.mDrag_ = this.drag.bind(this);
    this.mDragEnd_ = this.dragEnd.bind(this);
    this.position_ = [0, 0];
    this.render();
  }

  render (createEl) {
    let imgEl, selector, close, btnApply;
    this.el = createEl('div', 'tg-image-editor', [
      createEl('div', 'tg-image-editor-wnd', [
        createEl('div', 'tg-image-editor-header', [
          close = new IconClose(),
          createEl('div', 'tg-image-editor-title', [this.i18n.t('image_editor_title')])
        ]),
        this.selector = selector = createEl('div', 'tg-image-editor-selector', [
          this.imgEl = imgEl = createEl('img', {class: 'tg-image-editor-image hidden', src: this.url_}),
          //<svg class="tg-image-editor-overlay"><circle cx="50%" cy="50%" fill="transparent" stroke-width="180" r="250" stroke="rgba(246, 243, 233, 0.9)"></circle></svg>
          createEl('svg', {}, [
            createEl('circle', {cx:"50%", cy:"50%", fill:"transparent", 'stroke-width':"180", r:"250", stroke:"rgba(246, 243, 233, 0.9)"}, [], 'http://www.w3.org/2000/svg')
          ], 'http://www.w3.org/2000/svg')
        ]),
        btnApply = new ButtonSubmit(new IconCheck(), '')
      ])
    ]);

    close.el.addEventListener('click', () => this.emit('close'));

    imgEl.onload = () => {
      const size = selector.offsetWidth;
      let w = imgEl.offsetWidth
      let h = imgEl.offsetHeight;
      if (w < size || h < size) {
        this.coeff = size / Math.min(w, h);
        imgEl.style.width = w * this.coeff + 'px';
        imgEl.style.height = h * this.coeff + 'px';
      } else {
        this.coeff = 1;
      }
      imgEl.classList.remove('hidden');
    }

    imgEl.addEventListener('mousedown', this.mDragStart_);
    imgEl.addEventListener('touchstart', this.mDragStart_);
    imgEl.addEventListener('dragstart', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    });

    btnApply.on('action', () => {
      this.cropImage();
    });
  }

  dragStart (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.touches && ev.touches.length) {
      ev = ev.touches[0];
    }
    document.addEventListener('mousemove', this.mDrag_);
    document.addEventListener('touchmove', this.mDrag_);
    document.addEventListener('mouseup', this.mDragEnd_);
    document.addEventListener('touchend', this.mDragEnd_);

    const size = this.selector.offsetWidth;
    let w = this.imgEl.offsetWidth
    let h = this.imgEl.offsetHeight;

    this.drag_ = {
      x: ev.pageX,
      y: ev.pageY,
      minX: size - w,
      maxX: 0,
      minY: size - h,
      maxY: 0
    };
    document.body.classList.add('tg-cursor-move');
  }

  drag (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.touches && ev.touches.length) {
      ev = ev.touches[0];
    }
    const dx = ev.pageX - this.drag_.x;
    const dy = ev.pageY - this.drag_.y;
    this.drag_.x = ev.pageX;
    this.drag_.y = ev.pageY;

    this.position_[0] = Math.max(Math.min(this.position_[0] + dx, this.drag_.maxX), this.drag_.minX);
    this.position_[1] = Math.max(Math.min(this.position_[1] + dy, this.drag_.maxY), this.drag_.minY);

    this.imgEl.style.transform = `translate(${this.position_[0]}px, ${this.position_[1]}px)`;
  }

  dragEnd () {
    document.removeEventListener('mousemove', this.mDrag_);
    document.removeEventListener('touchmove', this.mDrag_);
    document.removeEventListener('mouseup', this.mDragEnd_);
    document.removeEventListener('touchend', this.mDragEnd_);
    document.body.classList.remove('tg-cursor-move');
  }

  cropImage () {
    const img = this.imgEl;
    const position = this.position_;
    const size = this.selector.offsetWidth / (window.devicePixelRatio || 1);

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position: fixed; top: 0; left: 0';
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.scale(this.coeff, this.coeff);
    ctx.drawImage(img, -position[0] / this.coeff, -position[1] / this.coeff, size, size, 0, 0, size, size);
    canvas.toBlob((blob) => {
      this.emit('apply', blob);
    }, 'image/png');
  }
}

export default ImageEditor;
