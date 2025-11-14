/**
 * PseudoScreen component for authentication that demonstrates how to do
 * Firebase email/password authentication  (signUp, signIn, and signOut)
 * in the context of SimplerChatApp.
 * 
 * This version is *nonpersistent*: i.e., when the user closes the app when
 * they're signed in, they need to sign in again when the app relaunches
 *
 * For simplicity, this combines signUp, signIn, and signOut in a single
 * pseudoScreen, but in your final projects you may want separate screens
 * for signUp (registration) and signIn. 
 * 
 * Also, signOut typically requires only a signOut button, not an entire screen. 
 * 
 */

import { useState } from 'react';
import { KeyboardAvoidingView, Text, TextInput, View } from 'react-native';
import { RNPButton } from './RNPButton.js'; // Lyn's wrapper for react-native-paper button
import LabeledTextInput from './LabeledTextInput.js';
import styles from '../styles';
import { auth,  // Firebase authentication object
         useSignedInUser // hook for tracking whether user is signed in or not
       } from '../firebaseInit-authDb'; // change this init file for this version

import { // for email/password signup (registration):
         createUserWithEmailAndPassword, sendEmailVerification,
         // for email/password signin
         signInWithEmailAndPassword, 
         // for logging out:
         signOut
  } from "firebase/auth";

export default function SignInOutPScreen( {changePscreen} ) {

  // Default email and password (simplifies testing)
  // const defaultEmail = ... your email here ...
  // const defaultPassword = ... your password here ...
  const defaultEmail = '';
  const defaultPassword = 'password' // A terrible password in general, but
                                     // OK for testing Firebase authentication

  /**  State variable for email input; provide default email for testing */
  const [email, setEmail] = useState(defaultEmail); 

  /**  State variable for password input; provide default password for testing */
  const [password, setPassword] = useState(defaultPassword); 

  /**  State variable for errors and other feedback displayed in red box */
  const [errorMsg, setErrorMsg] = useState('');

  /**  Modular way to track whether signedInUser is a user object or null */
  const signedInUser = useSignedInUser();

  /**
   * @param {string} msg
   *
   * @modifies errorMsg state variable and console to display msg
   */
  function displayErrorMsg(msg) {
    console.log(msg); // for debugging from console:     
    setErrorMsg(msg); 
  }

  /**
   * Wrapper for auth createUserWithEmailAndPassword function that:
   *   1. Checks email and password input for valdity
   *   2. Uses errorMsg to tell user to check for verification email 
   */
  async function signUpUserEmailPassword() {
    if (!isValidEmail(email)) { return; }
    if (!isValidPassword(password)) { return; }    
    try {
      // Invoke Firebase authentication API for email/password sign up
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // could also use auth.currentUser            
      console.log(`signUpUserEmailPassword for email '${email}' succeeded but still needs verification; user object is ${JSON.stringify(user)}`);
      // Send verification email
      await sendEmailVerification(user);
      displayErrorMsg(`signUp: a verification email has been sent to ${user.email}. You will not be able to sign in to this account until you click on the verification link in that email.`);
      // Don't clear email/password inputs, because likely to sign *in* with them. 
    } catch (error) {
      const errorMessage = error.message; 
      // const errorCode = error.code; // Could use this, too.
      displayErrorMsg(`signUp: ${errorMessage}`);
    };
  }

  /**
   * @param {string} emailString
   *
   * @returns boolean indicating whether emailString is a valid email address.
   *
   * @modifies errorMsg to specify an error message for any emailString
   *   that is invalid.
   */
  function isValidEmail(emailString) {
    // Put any tests here for email string validity
    if (!email.includes('@')) {
      displayErrorMsg(`email '${emailString}' invalid: does not contain @`);
      return false;
    }
    return true;    
  }

  /**
   * @param {string} passwordString
   *
   * @returns boolean indicating whether passwordString is a valid password.
   *
   * @modifies errorMsg to specify an error message for any passwordString
   *   that is invalid.
   */
  function isValidPassword(passwordString) {
    // Put any tests here for password string validity
    if (password.length < 8) {
      displayErrorMsg(`password '${passwordString}' invalid: too short.`);      
      return false;      
    }
    return true;    
  }

  /**
   * Wrapper for auth signInWithEmailAndPassword function that:
   *   1. Verifies that signed in user is verified (and otherwise reminds
   *      them to verify if not)
   *   2. Sets email and password inputs back to defaults 
   *   3. Navigates to chat pScreen if user is verified 
   */
  async function signInUserEmailPassword() {
    if (!isValidEmail(email)) { return; }
    if (!isValidPassword(password)) { return; }    
    try {
      // Invoke Firebase authentication API for email/password sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // could also use auth.currentUser      
      // Only log in user if their email is verified
      if (checkEmailVerification(user)) {
        // Clear email/password inputs
        console.log(`signInUserEmailPassword for email '${email}' succeeded with verified user object ${JSON.stringify(userCredential.user)}.`);
	
        setEmail(defaultEmail);
        setPassword(defaultPassword);
        changePscreen('chat'); // Go to the Chat PseudoScreen
      } // No need for `else` b/c checkEmailVerification displays errorMsg
        // for unverified users
    } catch (error) {
      displayErrorMsg(`signIn error: ${error.message}`);
    }
  }

  /**
   * @param {Object} user: non-null user object 
   * @returns boolean indicating whether user.email is verified 
   * @modifies errorMsg in case where user.email is not verified. 
   */
  function checkEmailVerification(user) {
    if (user.emailVerified) {
      console.log(`checkEmailVerification: ${user.email} is verified`);
      setErrorMsg(''); // clear any previous error message
      return true;
    } else {
      displayErrorMsg(`checkEmailVerification: You cannot sign in as ${user.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${user.email}.`)
      return false; 
    }
  }

  /**
   * Logs out current user.
   * @returns undefined
   */
  async function logOut() {
    console.log(`signOut for email ${signedInUser.email}`);
    await signOut(auth);
  }

  /*
   * emailInput and passwordInput are component-like functions (whose names
   * begin with lowercase letters) that encapsulate TextInput components.
   * They can't be actual components (whose names begin with capital letters)
   * because of the issue described in
   *
   *   https://stackoverflow.com/questions/59891992/keyboard-dismisses-while-typing-textinput-in-nested-functional-component-react-n
   *
   * that causes the keyboard to close after every character is typed.
   * Instead, they must be called as regular functions within JSX to
   * avoid this problem.
   */

  const emailInput = () => (
      <LabeledTextInput
          label='Email:'
          placeholder='Enter your email'     
          defaultValue={defaultEmail}
          onChangeText={ text => {setEmail(text);  setErrorMsg('');} }
          keyboardType='email-address' // includes @ character
      />
  );

  const passwordInput = () => (
      <LabeledTextInput
        label='Password:'    
        placeholder='Enter your password'     
        defaultValue={password}
        onChangeText={ text => {setPassword(text);  setErrorMsg('');} }
        keyboardType='default' // does not include @ character
      />
  );

  const AuthButtons = () => (
      <View style={styles.buttonHolder}>
        <RNPButton 
           title='Sign In' 
           onPress={signInUserEmailPassword}
        />
        <RNPButton 
           title='Sign Up' 
           onPress={signUpUserEmailPassword}
        />
      </View>
  );

  const ErrorMsg = () => (  
      <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
        <Text style={styles.errorMessage}>{errorMsg}</Text>
      </View>
  );

  /*
   * Like emailInput and passwordInput above, signInUpPane is a
   * component-like function (whose name begins with a lowercase letter)
   * rather than an actual component (whose name begins with a capital letter)
   * because of the issue described in
   *
   *   https://stackoverflow.com/questions/59891992/keyboard-dismisses-while-typing-textinput-in-nested-functional-component-react-n
   *
   * that causes the keyboard to close after every character is typed.
   * Instead, it must be called as regular functions within JSX to
   * avoid this problem.
   */
  const signInUpPane = () => (
    // KeyboardAvodingView helps to prevent a keyboard from covering
    // the TextInput component in which text is being entered. See
    //   https://reactnative.dev/docs/keyboardavoidingview
    // and
    //   https://www.freecodecamp.org/news/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580/
    <KeyboardAvoidingView
       behavior='padding'
       // Using styles.hidden (with display 'none') and other styles
       // is another way to hide/show views. 
       style={signedInUser?.emailVerified ? styles.hidden : styles.signInOutPane }
    >	   
      {emailInput()}
      {passwordInput()}    
      <AuthButtons/>
      <ErrorMsg/>
    </KeyboardAvoidingView>
  );

  const SignOutPane = () => (
      <View
         // Using styles.hidden (with display 'none') and other styles
         // is another way to hide/show views. 
         style={signedInUser?.emailVerified ? styles.signInOutPane : styles.hidden }
      >
        <Text style={styles.pscreenText}>
          You are signed in as {signedInUser?.email}
        </Text>
        <RNPButton title="Sign Out" onPress={logOut}/>
      </View>
  )

  return (
    <View style={styles.pscreen}>
      {signInUpPane()}
      <SignOutPane/>
    </View>
  );

}

