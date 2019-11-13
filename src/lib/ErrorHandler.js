import Store from 'ROOT/store';

function ErrorHandler (error) {
  if (error.code === 401) {
    Store.setStateValue('authorized', false);
  } else {
    console.log(error);
  }
}

export default ErrorHandler
