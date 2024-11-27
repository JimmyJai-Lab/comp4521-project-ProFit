import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface UserContextType {
    user: FirebaseAuthTypes.User | null;
    userProfile: any | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    userProfile: null,
    loading: true
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeProfile: (() => void) | undefined;

        const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
            setUser(user);

            if (user) {
                unsubscribeProfile = firestore()
                    .collection('users')
                    .doc(user.uid)
                    .onSnapshot((doc) => {
                        setUserProfile(doc.exists ? doc.data() : null);
                    }, (error) => {
                        console.error("Firestore snapshot error:", error);
                        setUserProfile(null);
                    });
            } else {
                if (unsubscribeProfile) {
                    unsubscribeProfile();
                }
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) {
                unsubscribeProfile();
            }
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, userProfile, loading }}>
            {!loading && children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);