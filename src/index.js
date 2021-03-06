import Application from 'ROOT/components/Application';
import 'ROOT/styles/application.css';
import 'ROOT/styles/reset.css';
import 'ROOT/styles/input.css';
import 'ROOT/styles/checkbox.css';
import 'ROOT/styles/chatlist.css';
import 'ROOT/styles/chatcontent.css';
import 'ROOT/styles/auth.css';
import 'ROOT/styles/imageeditor.css';
import 'ROOT/styles/ripple.css';
import 'ROOT/styles/loader.css';

import 'ROOT/images/tg_logo160x160.png';
import 'ROOT/images/flags.png';
import 'ROOT/images/checkboxon_svg.svg';
import 'ROOT/images/checkboxempty_svg.svg';

import 'ROOT/stickers/TwoFactorSetupMonkeyClose.tgs';
import 'ROOT/stickers/TwoFactorSetupMonkeyCloseAndPeek.tgs';
import 'ROOT/stickers/TwoFactorSetupMonkeyCloseAndPeekToIdle.tgs';
import 'ROOT/stickers/TwoFactorSetupMonkeyIdle.tgs';
import 'ROOT/stickers/TwoFactorSetupMonkeyPeek.tgs';
import 'ROOT/stickers/TwoFactorSetupMonkeyTracking.tgs';

const app = new Application();

document.body.appendChild(app.el);
