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
   * Attempts to have locally defined LabeledTextInput component here
   * (rather than one imported from a separate file) empirically just
   * don't work. The cause the keyboard to hide after every character,
   * which is unacceptable. This seems to happen for any local component
   * that encapsulates a TextInput component.
   *
   * However, locally defined components that do *not* contain a
   * TextInput component appear to work fine. 
   */

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

  const ErrorMsg = ( { errorMsg } ) => (  
      <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
        <Text style={styles.errorMessage}>{errorMsg}</Text>
      </View>
  );  
  
  return (
    <View style={styles.screen}>
      <LabeledTextInput
          label='Email:'
          placeholder='Enter your email'     
          defaultValue={email}
          onChangeText={ text => {setEmail(text);  setErrorMsg('');} }
          keyboardType='email-address' // includes @ character
      />
      <LabeledTextInput
        label='Password:'    
        placeholder='Enter your password'     
        defaultValue={password}
        onChangeText={ text => {setPassword(text);  setErrorMsg('');} }
        keyboardType='default' // does not include @ character
      />
      <AuthButtons/>
      <ErrorMsg errorMsg={errorMsg}/>
    </View>
  );

}

