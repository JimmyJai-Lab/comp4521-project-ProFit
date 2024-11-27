import auth from "@react-native-firebase/auth";

export interface IAccountService {
  registerUser: (
    email: string,
    password: string,
    // onCreated: (account: Account) => void,
  ) => void;
  logInUser: (
    email: string,
    password: string,
    // onCreated: (account: Account) => void,
  ) => void;
  logOutUser: () => void;
  deleteUser: (onDeleted: () => void, onError: (Error: Error) => void) => void;
}

class AccountService implements IAccountService {
  registerUser(
    email: string,
    password: string,
    // onCreated: (account: Account) => void,
  ) {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // const { user } = userCredential;
        // onCreated({
        //   id: user.uid,
        //   name: user.displayName,
        //   email: user.email,
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logInUser(
    email: string,
    password: string,
    // onCreated: (account: Account) => void,
  ) {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // const { user } = userCredential;
        // onCreated({
        //   id: user.uid,
        //   name: user.displayName,
        //   email: user.email,
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logOutUser() {
    auth().signOut();
  }

  deleteUser(onDeleted: () => void, onError: (error: Error) => void) {
    auth()
      .currentUser?.delete()
      .then(() => {
        onDeleted();
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

const accountService = new AccountService() as IAccountService;
export default accountService;
