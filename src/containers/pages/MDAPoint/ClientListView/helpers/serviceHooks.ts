import { Dictionary } from '@onaio/utils';
import { toast } from 'react-toastify';
import { OPENSRP_API_BASE_URL } from '../../../../../configs/env';
import { FILE_UPLOADED_SUCCESSFULLY } from '../../../../../configs/lang';
import { OPENSRP_FILE_UPLOAD_HISTORY_ENDPOINT } from '../../../../../constants';
import { growl } from '../../../../../helpers/utils';
import { OpenSRPService } from '../../../../../services/opensrp';
import store from '../../../../../store';
import { fetchFiles, File } from '../../../../../store/ducks/opensrp/files';
import { getAccessToken } from '../../../../../store/selectors';

/** loads files data
 */
export const loadFiles = async () => {
  const serve = new OpenSRPService(OPENSRP_FILE_UPLOAD_HISTORY_ENDPOINT);
  serve
    .list()
    .then((response: File[]) => {
      store.dispatch(fetchFiles(response, true));
    })
    .catch((err: Error) => {
      growl(err.message, { type: toast.TYPE.ERROR });
    });
};
/**
 * Posts uploaded file to opensrp
 * Todo:
 * Investigate why opensrp service fails to upload file
 * @param data uploaded formdata payload
 * @param setStateIfDone set state to trigger redirect on upload
 */
export const postUploadedFile = async (data: any, setStateIfDone: () => void) => {
  const bearer = `Bearer ${getAccessToken(store.getState())}`;
  await fetch(`${OPENSRP_API_BASE_URL}/upload/?event_name=Child%20Registration`, {
    body: data,
    headers: {
      Authorization: bearer,
    },
    method: 'POST',
  })
    .then(response => response.json())
    .then(async () => {
      growl(FILE_UPLOADED_SUCCESSFULLY, {
        onClose: () => setStateIfDone(),
        type: toast.TYPE.SUCCESS,
      });
      await loadFiles();
    })
    .catch(err => {
      growl(err.message, { type: toast.TYPE.ERROR });
    });
};
/**
 * Handles file downloads from server
 * @param {string} id csv identifier
 * @param {string} name file name
 */
export const handleDownload = (id: string, name: string, params?: Dictionary) => {
  const apiEndpoint = params ? `upload` : `upload/download`;
  const downloadService = new OpenSRPService(apiEndpoint);
  downloadService
    .readFile(id, params)
    .then(res => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = name;
      a.click();

      window.URL.revokeObjectURL(url);
    })
    .catch(err => {
      growl(err.message, { type: toast.TYPE.ERROR });
    });
};
