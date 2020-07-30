import { HTTPError, NetworkError } from '@opensrp/server-service';
import { toast, ToastOptions } from 'react-toastify';
import { ACCESS_DENIED, NETWORK_ERROR, USER_HAS_NO_VALID_ASSIGNMENTS } from '../configs/lang';
import { growl } from './utils';

/** union of all ErrorTypes that we are working with */
type ServiceError = HTTPError | Error | NetworkError;

/** autoClose types */
type AutoClose = 5000 | false;

/**
 * Display error message using growl
 * @param error - the error object
 * @param customMessage - custom error message
 * @param autoClose - Delay in ms to close the toast. If set to false,
 * the notification needs to be closed manually
 */

export const displayError = (
  error: ServiceError,
  customMessage: string = '',
  autoClose: AutoClose = 5000
) => {
  /** opensrp error object for plans after filtering plans by a user when the assignments are expired
   * unfortunately putting this in constants does not work; it has a value of undefined during runtime.
   */
  const toastOptions: ToastOptions = { autoClose, type: toast.TYPE.ERROR };

  if (error instanceof HTTPError) {
    const isPlansFilterByUserRoute = error.url.includes('rest/plans/user/');
    if (error.statusCode === 403) {
      const msg = customMessage !== '' ? customMessage : ACCESS_DENIED;
      growl(msg, toastOptions);
      return;
    }
    if (error.statusCode === 500 && isPlansFilterByUserRoute) {
      const msg = customMessage !== '' ? customMessage : USER_HAS_NO_VALID_ASSIGNMENTS;
      growl(msg, toastOptions);
      return;
    }
  }
  if (error instanceof NetworkError) {
    const msg = customMessage !== '' ? customMessage : NETWORK_ERROR;
    growl(msg, toastOptions);
    return;
  }
  const message = customMessage !== '' ? customMessage : error.message;
  growl(message, toastOptions);
};
