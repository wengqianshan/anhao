import AsyncStorage from '@react-native-async-storage/async-storage';

export let host = 'https://wenglou.com';

export async function setHost(val) {
  host = val;
  await AsyncStorage.setItem('host', val);
}

export function getApi(path) {
  return `${host}/api/v1${path}`;
}

export function list(page) {
  const api = getApi(`/content?current=${page}`);
  return new Promise((resolve, reject) => {
    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        resolve(res.data);
      });
  });
}

export function detail(id) {
  const api = getApi(`/content/${id}`);
  return new Promise((resolve, reject) => {
    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        // console.log('detail: ->', res);
        resolve(res.data);
      });
  });
}

export async function delDetail(id) {
  const token = await AsyncStorage.getItem('userToken');
  const api = getApi(`/content/${id}?token=${token}`);
  return new Promise((resolve, reject) => {
    // let formData = new FormData();
    // formData.append("username", "hello");
    fetch(api, {
      method: "DELETE",
      // body: FormData,
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      // },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        resolve(res.data);
      });
  });
}
