import Store from 'ROOT/store';
import Config from 'ROOT/config'

function ErrorHandler (error) {
  if (error.code === 401 || error.type === 'PHONE_CODE_EXPIRED') {
    Store.setStateValue('authorized', false);
  } else {
    if (Config.modes.test) {
      console.log(error);
    }
  }
  return error;
}

export default ErrorHandler
