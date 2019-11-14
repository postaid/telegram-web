import Store from 'ROOT/store';
import Config from 'ROOT/config'

function ErrorHandler (error) {
  if (error.code === 401) {
    Store.setStateValue('authorized', false);
  } else {
    if (Config.modes.test) {
      console.log(error);
    }
  }
  return error;
}

export default ErrorHandler
