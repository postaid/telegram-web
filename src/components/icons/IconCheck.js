import Icon from 'ROOT/components/icons/Icon'

const TEMPLATE = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\n' +
  '  <g fill="none" fill-rule="evenodd">\n' +
  '    <polygon points="0 0 24 0 24 24 0 24"/>\n' +
  '    <path fill="currentColor" fill-rule="nonzero" d="M4.70710678,12.2928932 C4.31658249,11.9023689 3.68341751,11.9023689 3.29289322,12.2928932 C2.90236893,12.6834175 2.90236893,13.3165825 3.29289322,13.7071068 L8.29289322,18.7071068 C8.68341751,19.0976311 9.31658249,19.0976311 9.70710678,18.7071068 L20.7071068,7.70710678 C21.0976311,7.31658249 21.0976311,6.68341751 20.7071068,6.29289322 C20.3165825,5.90236893 19.6834175,5.90236893 19.2928932,6.29289322 L9,16.5857864 L4.70710678,12.2928932 Z"/>\n' +
  '  </g>\n' +
  '</svg>';
class IconCheck extends Icon {
  constructor () {
    super(TEMPLATE, 'IconCheck');
  }
}

export default IconCheck;
