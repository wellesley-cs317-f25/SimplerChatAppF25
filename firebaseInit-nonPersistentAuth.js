/** 
 * Version of firebaseInit that provides only nonpersistent auth
 * and no other features. Authorization is nonpersistent in the
 * sense that if the app is closed while the user is signed in,
 * they must sign in again when relaunching the app. 
 */



// firebaseConfig holds credentials for Firebase project
import { firebaseConfig } from "./firebaseConfig.js"

/**
 * Create a Firebase app named `firebaseApp` that's necessary for 
 * accessing all firebase features
 */
import { initializeApp } from "firebase/app";
const firebaseApp = initializeApp(firebaseConfig);

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export const auth = getAuth();

/** 
 * Custom hook written by Lyn for tracking signedInUser inspired by
 * old useAuthState hook that worked in Firebase v.10 but not in v.12
 *
 * I consulted this documentation on custom hooks:
 *   https://react.dev/learn/reusing-logic-with-custom-hooks
 * and this documentation on onauthstatechanged:
 *   https://blog.stackademic.com/concept-clear-of-onauthstatechanged-e8dddd4ff5c8
 */
export function useSignedInUser() {
  const [signedInUser, setSignedInUser] = useState(null);
  useEffect(
    () => {
      console.log('subscribing to onAuthStateChanged');
      const unsubscribe = onAuthStateChanged(auth, currentUser => {
        console.log(`onAuthStateChanged callback called with currentUser?.email = ${currentUser?.email}`);
	setSignedInUser(currentUser); 
      })
      return () => {
	console.log('unsubscribing from onAuthStateChanged');
        unsubscribe();
      }
    },
    [] // no dependencies
  ); 
  return signedInUser; 
}



