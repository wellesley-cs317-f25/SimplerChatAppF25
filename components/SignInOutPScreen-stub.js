/**
 * This is just a nonworking stub for an authentication pseudoScreen
 * for SimplerChatApp.
 * 
 * Pressing a button just displays an alert. 
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
  const defaultPassword = ''

  /**  State variable for email input; provide default email for testing */
  const [email, setEmail] = useState(defaultEmail); 
  /**  State variable for password input; provide default password for testing */
  const [password, setPassword] = useState(defaultPassword); 
  /**  State variable for errors and other feedback displayed in red box */
  const [errorMsg, setErrorMsg] = useState(''); 

  /**
   * Wrapper for auth createUserWithEmailAndPassword function that:
   *   1. Checks email and password input for valdity
   *   2. Uses errorMsg to tell user to check for verification email 
   */
  async function signUpUserEmailPassword() {
    alert(`Calling stub function signUpUserEmailPassword()
with email ${email} and password ${password}`);
  }

  async function signInUserEmailPassword() {
    alert(`Calling stub function signInUserEmailPassword()
with email ${email} and password ${password}`);
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

