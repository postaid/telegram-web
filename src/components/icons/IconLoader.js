import Icon from 'ROOT/components/icons/Icon'

const TEMPLATE = '<svg width="24px" height="24px" viewBox="25 25 50 50">' +
  '<circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="3" stroke-miterlimit="10" class="path"></circle>' +
  '</svg>';

class IconLoader extends Icon {
  constructor () {
    super(TEMPLATE, 'IconLoader');
  }
}

export default IconLoader;
