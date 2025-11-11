/**
 * This is just a stub for an authentication pseudoScreen for SimplerChatApp.
 * It demonstrates helpful attributes for TextInput text boxes. It also
 * demonstrates RNPButtons (Lyn's abstraction over ReactNativePaper buttons).
 * Pressing such a a button just displays the same message in an alert
 * and the errorMsg area. 
 */

import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { RNPButton } from './RNPButton.js'; // Lyn's wrapper for react-native-paper button
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
    const msg = `Calling stub function signUpUserEmailPassword()
with email '${email}' and password '${password}'`;
    setErrorMsg(msg);
    // Alternatively could use an alert for feedback:
    // alert(msg);
  }

  /**
   * Stub function that just displays email and password in errorMsg area. 
   */  
  async function signInUserEmailPassword() {
    const msg = `Calling stub function signInUserEmailPassword()
with email '${email}' and password '${password}'`;
    setErrorMsg(msg);
    // Alternatively could use an alert for feedback:
    // alert(msg);
  }
  
  return (
    <View style={styles.screen}>
      <View style={styles.labeledInput}>
        <Text style={styles.inputLabel}>Email:</Text>
        <TextInput 
           placeholder='Enter your email address' 
           style={styles.textInput} 
           value={email} 
           onChangeText={ 
              text => {
                setEmail(text);
                setErrorMsg(''); // Clear any error message
              }
            }
            // Helpful settings from CS317 F23 final project team TasteBuds:
            // 
            // Note: keyboard type can be one of the following: 
            // default, number-pad, decimal-pad, numeric, email-address, phone-pad, url
            keyboardType='email-address'
            autoCorrect={false}
            autoCapitalize='none'
            autoComplete='off'
          /> 
      </View>
      <View style={styles.labeledInput}>
        <Text style={styles.inputLabel}>Password:</Text>
        <TextInput 
           placeholder='Enter your password' 
           style={styles.textInput} 
           value={password} 
           onChangeText={ 
             text => {
               setPassword(text);
               setErrorMsg(''); // Clear any error message
             }
           }
           // Helpful settings from CS317 F23 final project team TasteBuds:
           autoCorrect={false}
           autoCapitalize='none'
           autoComplete='off'
         />
      </View>
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
      <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
        <Text style={styles.errorMessage}>{errorMsg}</Text>
      </View>
    </View>
  );

}

