import Component from 'ROOT/lib/Component'
import TemplateGenerator from 'ROOT/lib/TemplateGenerator'

/*
const TEMPLATE = '<svg width="44" height="37" viewBox="0 0 44 37" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '<rect width="33" height="33" transform="translate(9 1)" fill="black"/>\n' +
  '<g filter="url(#filter0_d)">\n' +
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M21 1C14.3726 1 9 6.37258 9 13V{VVALUE}C8.99769 17.0339 8.70351 21.2769 6.95043 25.7824C5.98276 28.2693 4.04188 30.5055 2.49038 32.0151C1.79969 32.6871 2.27326 34 3.23693 34H9H{HVALUE}C36.6274 34 42 28.6274 42 22V{VVALUE}C42 6.37258 36.6274 1 30 1H{HVALUE}Z" fill="white"/>\n' +
  '</g>\n' +
  '<defs>\n' +
  '<filter id="filter0_d" x="0.16272" y="0" width="43.8373" height="37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n' +
  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>\n' +
  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>\n' +
  '<feOffset dy="1"/>\n' +
  '<feGaussianBlur stdDeviation="1"/>\n' +
  '<feColorMatrix type="matrix" values="0 0 0 0 0.0621962 0 0 0 0 0.138574 0 0 0 0 0.185037 0 0 0 0.15 0"/>\n' +
  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>\n' +
  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>\n' +
  '</filter>\n' +
  '</defs>\n' +
  '</svg>';
*/

const TEMPLATE = '<svg fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '<g>\n' +
  '<path fill-rule="evenodd" clip-rule="evenodd" d="" fill="currentColor"/>\n' +
  '</g>\n' +
  '<defs>\n' +
  '<filter id="" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n' +
  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>\n' +
  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>\n' +
  '<feOffset dy="1"/>\n' +
  '<feGaussianBlur stdDeviation="1"/>\n' +
  '<feColorMatrix type="matrix" values="0 0 0 0 0.0621962 0 0 0 0 0.138574 0 0 0 0 0.185037 0 0 0 0.15 0"/>\n' +
  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>\n' +
  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>\n' +
  '</filter>\n' +
  '</defs>\n' +
  '</svg>';

const pathD =
'M21 1 ' +
'C14.3726 1 9 6.37258 9 13 ' +
'V{H} ' +
'C8.99769 {H} 8.70351 {H} 6.95043 {H} ' +
'C5.98276 {H} 4.04188 {H} 2.49038 {H} ' +
'C1.79969 {H} 2.27326 {H} 3.23693 {H} ' +
'H9 ' +
'H{W} ' +
'C{W} {H} {W} {H} {W} {H} ' +
'V13 ' +
'C{W} 6.37258 {W} 1 {W} 1 ' +
'H{W} ' +
'Z';
class BubbleWhole extends Component {
  constructor (width, height) {
    super();
    this.height = height;
    this.width = width;
    this.render();
  }

  render (createEl) {
    this.el = TemplateGenerator.generate(TEMPLATE, 'bubble-whole');
    const path = this.el.getElementsByTagName('path')[0];
    if (path) {
      const d = pathD;
      const dW = this.width + 8 - 30;
      const dH = this.height - 18 - 17;

      const ws = [30, 36.6274, 42, 42, 42, 36.6274, 30, 21]
      const hs = [0, 17, 21.2769, 25.7824, 28.2693, 30.5055, 32.0151, 32.6871, 34, 34, 34, 28.6274, 22];

      let i = 0;
      let resD = d.replace(/{H}/g, () => hs[i++] + dH);
      i = 0;
      resD = resD.replace(/{W}/g, () => ws[i++] + dW);
      path.setAttribute('d', resD);
    }

    const filterId = Math.round(Math.random() * 9999999999);
    this.el.getElementsByTagName('filter')[0].id = filterId;
    this.el.getElementsByTagName('g')[0].setAttribute('filter', 'url(#' + filterId + ')');
    this.el.style.width = this.width + 20 + 'px';
    this.el.style.height = this.height + 'px';
    this.el.classList.add('bubble-whole');
    this.el.setAttribute('viewBox', '-2 -2 ' + (this.width + 20 + 2) + ' ' + (this.height + 2));
  }
}

export default BubbleWhole;
