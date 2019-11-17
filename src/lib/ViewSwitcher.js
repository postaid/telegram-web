
class ViewSwitcher {

  /**
   *
   * @param {Array.<{name: string, c: Component}>} views
   * @param {HTMLElement} placeholder
   */
  constructor (views, placeholder) {
    this.views_ = views.reduce((res, v) => {
      res[v.name] = {c: v.c, e: null};
      return res;
    }, {});
    this.currentView_ = '';
    this.placeholder_ = placeholder;
  }

  showView (name) {
    if (name === this.currentView_) {
      const v = this.views_[name];
      if (v && v.e && v.e.beforeShow) {
        v.e.beforeShow();
      }
      return;
    }
    const curView = this.views_[this.currentView_];
    if (curView && curView.e && curView.e.el.parentNode) {
      if (curView.e.beforeHide) {
        curView.e.beforeHide();
      }
      curView.e.el.parentNode.insertBefore(this.placeholder_, curView.e.el);
      curView.e.el.parentNode.removeChild(curView.e.el);
    }
    const v = this.views_[name];
    if (v) {
      this.currentView_ = name;
      if (!v.e) {
        v.e = new v.c();
      }
      if (v.e.beforeShow) {
        v.e.beforeShow();
      }
      this.placeholder_.parentNode.insertBefore(v.e.el, this.placeholder_);
      this.placeholder_.parentNode.removeChild(this.placeholder_);
    }
  }
}

export default ViewSwitcher
