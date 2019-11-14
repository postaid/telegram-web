import Icon from 'ROOT/components/icons/Icon'

const TEMPLATE = '<svg xmlns="http://www.w3.org/2000/svg" class="IconDropdownArrow" width="24" height="24" viewBox="0 0 24 24">\n' +
  '    <g fill="none" fill-rule="evenodd">\n' +
  '        <polygon points="0 0 24 0 24 24 0 24"/>\n' +
  '        <path fill="currentColor" fill-rule="nonzero" d="M12,9.41421356 L18.2928932,15.7071068 C18.6834175,16.0976311 19.3165825,16.0976311 19.7071068,15.7071068 C20.0976311,15.3165825 20.0976311,14.6834175 19.7071068,14.2928932 L12.7071068,7.29289322 C12.3165825,6.90236893 11.6834175,6.90236893 11.2928932,7.29289322 L4.29289322,14.2928932 C3.90236893,14.6834175 3.90236893,15.3165825 4.29289322,15.7071068 C4.68341751,16.0976311 5.31658249,16.0976311 5.70710678,15.7071068 L12,9.41421356 Z"/>\n' +
  '    </g>\n' +
  '</svg>';
class IconDropdownArrow extends Icon {
  constructor () {
    super(TEMPLATE, 'IconDropdownArrow');
  }
}

export default IconDropdownArrow;
