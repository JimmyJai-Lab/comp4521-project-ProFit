import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

interface UserProfile {
  uid: string;
  email: string | null;
  username: string;
  createdAt: Date;
  age: number | null;
  height: number | null;
  weight: number | null;
}

export interface IAccountService {
  registerUser: (email: string, password: string, username: string) => Promise<void>;
  logInUser: (email: string, password: string) => Promise<void>;
  logOutUser: () => Promise<void>;
  deleteUser: () => Promise<void>;
}

class AccountService implements IAccountService {
  async registerUser(email: string, password: string, username: string): Promise<void> {
    try {
      // Check username availability first
      const usernameQuery = await firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

      if (!usernameQuery.empty) {
        throw new Error('Username is already taken. Please choose a different username.');
      }

      // Create authentication user
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.updateProfile({
        displayName: username,
      });

      if (!user) {
        throw new Error('Failed to create user account');
      }

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date(),
        age: null,
        height: null,
        weight: null,
      };

      await firestore().collection('users').doc(user.uid).set(userProfile);

    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already registered. Please use a different email.');
      }
      throw error;
    }
  }

  async logInUser(email: string, password: string): Promise<void> {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logOutUser(): Promise<void> {
    try {
      const user = auth().currentUser;
      if (user) {
        // Unsubscribe from Firestore listener first
        await firestore().collection('users').doc(user.uid).onSnapshot(() => { });
        // Then sign out
        await auth().signOut();
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async deleteUser(): Promise<void> {
    try {
      const user = auth().currentUser;
      if (user) {
        // Delete user data from Firestore first
        await firestore().collection('users').doc(user.uid).delete();
        // Then delete the auth user
        await user.delete();
      }
    } catch (error: any) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
}

export default new AccountService();
