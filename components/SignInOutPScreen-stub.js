/**
 * This is just a stub for an authentication pseudoScreen for SimplerChatApp.
 * It demonstrates helpful attributes for TextInput text boxes. It also
 * demonstrates RNPButtons (Lyn's abstraction over ReactNativePaper buttons).
 * Pressing such a a button just displays the same message in an alert
 * and the errorMsg area. 
 */

import { useState } from 'react';
import { KeyboardAvoidingView, Text, TextInput, View } from 'react-native';
import { RNPButton } from './RNPButton.js'; // Lyn's wrapper for react-native-paper button
import LabeledTextInput from './LabeledTextInput.js';
import styles from '../styles';

export default function SignInOutPScreen() {

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

  /**
   * Stub function that just displays email and password in errorMsg area. 
   */
  async function signUpUserEmailPassword() {
    const msg = `Calling stub function signUpUserEmailPassword() with email '${email}' and password '${password}'`;
    setErrorMsg(msg);
    // Alternatively could use an alert for feedback:
    // alert(msg);
  }

  /**
   * Stub function that just displays email and password in errorMsg area. 
   */  
  async function signInUserEmailPassword() {
    const msg = `Calling stub function signInUserEmailPassword() with email '${email}' and password '${password}'`;
    setErrorMsg(msg);
    // Alternatively could use an alert for feedback:
    // alert(msg);
  }

  /*
   * emailInput and passwordInput are component-like functions that
   * encapsulate TextInput components, but they can't be actual components
   * (whose names begin with capital letters) because of the issue described in
   *
   *   https://stackoverflow.com/questions/59891992/keyboard-dismisses-while-typing-textinput-in-nested-functional-component-react-n
   *
   * which causes the keyboard to close after every character is typed.
   * Instead, they must be called as regular functions within JSX to
   * avoid this problem
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
   * component-like function rather than an actual component
   * (whose name begins with a capital letters) because of the issue
   * described in
   *
   *   https://stackoverflow.com/questions/59891992/keyboard-dismisses-while-typing-textinput-in-nested-functional-component-react-n
   *
   * which causes the keyboard to close after every character is typed.
   * Instead, it must be called as regular functions within JSX to
   * avoid this problem.
   */

  const signInUpPane = () => (
    // KeyboardAvodingView helps to prevent a keyboard from covering
    // the TextInput component in which text is being entered. See
    //   https://reactnative.dev/docs/keyboardavoidingview
    // and
    //   https://www.freecodecamp.org/news/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580/
    <KeyboardAvoidingView style={styles.signInOutPane} behavior='padding'>
      {emailInput()}
      {passwordInput()}    
      <AuthButtons/>
      <ErrorMsg/>
    </KeyboardAvoidingView>
  );

  return (
    <View style={styles.pscreen}>
      {signInUpPane()}      
    </View>
  )
}

