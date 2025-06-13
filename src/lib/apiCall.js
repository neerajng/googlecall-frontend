import axios from 'axios';

function execute(method, url, data = {}, header = {}) {
    return new Promise((resolve, reject) => {
        const uri = `${process.env.NEXT_PUBLIC_API}${url}`
        let config = {
            method: method,
            url: uri,
            withCredentials: true,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                ...header
            }
        };
        if (Object.keys(data).length > 0) {
            config.data = data
        }
        axios.request(config)
            .then((response) => {
                const data = response?.data
                if (data?.status === "success") resolve(data)
                else reject(data.message);
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                reject({
                    status: 'error',
                    message: error?.response?.data?.message ?? "Something didn’t work as expected. Don’t worry! Let’s try again.",
                    uri,
                    method
                });
            });

    })

}

function _get(uri, params = null, header = {}) {
  const searchParams = params
    ? '?' + new URLSearchParams(params).toString()
    : '';
  return execute('get', uri + searchParams, {}, header);
}

function _post(uri, body) {
  return execute('post', uri, JSON.stringify(body));
}

function _put(uri, body) {
  return execute('put', uri, JSON.stringify(body));
}

function _patch(uri, body) {
  return execute('patch', uri, JSON.stringify(body));
}

function _delete(uri) {
  return execute('delete', uri);
}

const apiCall = {
  _get,
  _post,
  _put,
  _patch,
  _delete
};

export default apiCall;
