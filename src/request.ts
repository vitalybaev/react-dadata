export interface RequestOptions {
  headers: { [header: string]: string };
  json: any;
}

let xhr: XMLHttpRequest;

export const makeRequest = (
  method: string,
  endpoint: string,
  data: RequestOptions,
  onReceiveData: (response: any) => void,
): void => {
  if (xhr) {
    xhr.abort();
  }

  xhr = new XMLHttpRequest();
  xhr.open(method, endpoint);
  if (data.headers) {
    for (const header in data.headers) {
      if (data.headers[header]) {
        xhr.setRequestHeader(header, data.headers[header]);
      }
    }
  }
  xhr.send(JSON.stringify(data.json));

  xhr.onreadystatechange = () => {
    if (!xhr || xhr.readyState !== 4) {
      return;
    }

    if (xhr.status === 200) {
      const responseJson = JSON.parse(xhr.response);
      if (responseJson && responseJson.suggestions) {
        onReceiveData(responseJson.suggestions);
      }
    }
  };
};
