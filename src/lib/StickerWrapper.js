class StickerWrapper {
  constructor (sticker) {
    this.sticker = sticker;
    this.isPlaying = false;
    this.timer_ = null;
  }

  playFor (time) {
    if (this.timer_) {
      clearTimeout(this.timer_);
    }
    const sticker = this.sticker;
    sticker.play();
    this.isPlaying = true;
    this.timer_ = setTimeout(() => {
      sticker.pause();
      this.isPlaying = false;
    }, time);
  }
}

export default StickerWrapper;
