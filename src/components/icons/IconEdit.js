import Icon from 'ROOT/components/icons/Icon'

const TEMPLATE = '<svg xmlns="http://www.w3.org/2000/svg" class="IconEdit" width="24" height="24" viewBox="0 0 24 24">\n' +
  '  <g fill="none" fill-rule="evenodd">\n' +
  '    <polygon points="0 0 24 0 24 24 0 24"/>\n' +
  '    <path fill="currentColor" fill-rule="nonzero" d="M7.70710678,20.7071068 C7.5195704,20.8946432 7.26521649,21 7,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,17 C3,16.7347835 3.10535684,16.4804296 3.29289322,16.2928932 L16.5857864,3 C17.3257272,2.26005924 18.5012114,2.22111499 19.2869988,2.88316725 L19.4142136,3 L21,4.58578644 C21.7399408,5.3257272 21.778885,6.50121136 21.1168328,7.28699879 L21,7.41421356 L7.70710678,20.7071068 Z M5,17.4142136 L5,19 L6.58578644,19 L16.5857864,9 L15,7.41421356 L5,17.4142136 Z M18,4.41421356 L16.414,5.99921356 L18,7.58521356 L19.5857864,6 L18,4.41421356 Z"/>\n' +
  '  </g>\n' +
  '</svg>\n';
class IconEdit extends Icon {
  constructor () {
    super(TEMPLATE, 'IconEdit');
  }
}

export default IconEdit;
