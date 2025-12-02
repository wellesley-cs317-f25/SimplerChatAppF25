/** 
 * Version of firebaseInit that provides Firebase storage in addition to
 * the firestore db and (nonpersistent) authentication. 
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Initalization for the firestore db
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
 * Initialize Firestore, which is accessed through the `db` object.
 * Firestore is used to store data that is organized into collections of
 * JSON-like documents.
 */
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(firebaseApp);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Initalization for the Firebase storage
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
 * Initialize Firebase Storage, which is accessed through the `storage` object.
 * Firebase Storage is used to store large files like images, videos, and audio files. 
 */
import { getStorage } from "firebase/storage";
export const storage = getStorage(firebaseApp);






