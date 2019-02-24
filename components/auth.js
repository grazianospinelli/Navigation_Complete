import { AsyncStorage } from 'react-native';

export const USER_KEY = 'auth-demo-key';
export const USER_MAIL = 'Logged-user-mail';
export const USER_PWD = 'Logged-user-pwd';
export const USER_UUID = 'Logged-user-uuid';

export const onSignIn = (mail, password, uuid) => {
  AsyncStorage.setItem(USER_KEY, 'true');
  AsyncStorage.setItem(USER_MAIL, mail);
  AsyncStorage.setItem(USER_PWD, password);
  AsyncStorage.setItem(USER_UUID, uuid);
};


export const onSignOut = () => {
  AsyncStorage.removeItem(USER_KEY);
  AsyncStorage.removeItem(USER_MAIL);
  AsyncStorage.removeItem(USER_PWD);
  AsyncStorage.removeItem(USER_UUID);
};

export const isSignedIn = () => new Promise((resolve, reject) => {
  AsyncStorage.getItem(USER_KEY)
    .then((res) => {
      if (res !== null) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(err => reject(err));
});
