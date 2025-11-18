import { useState} from "react";
import { TextInput, View } from 'react-native';
import { RNPButton } from './RNPButton.js'; // Lyn's wrapper for react-native-paper button
import { useSignedInUser // hook for tracking whether user is signed in or not
       } from '../firebaseInit-authDb'; 
import styles from '../styles';

export default function ComposeMessagePScreen( {changePscreen, postMessage} ) {

  // Components with state variables need to be defined in separate files
  // rather than as helper components within other components. 
  // Otherwise the state variables will be reinitialized in unexpected ways.    
  const [textInputValue, setTextInputValue] = useState('');

  /**  
   * Elegant way to track signedInUser in any component.
   * signedInUser will be null until a user signs up or signs in. 
   * After a user signs up or signs in, can test: 
   *   + signedInUser?.email: email of user (undefined if signedInUser is null)
   *   + signedInUser?.verified: whether signedInUser is verified (undefined if signedInUser is null)
   */
    const signedInUser = useSignedInUser();

  /**
   * Cancel the current message composition. 
   * This is the action for the Cancel button in the message composition pane.
   */ 
  function cancelAction() {
    changePscreen('chat'); // navigate back to chat screen
  }

  /**
    * Post a message to the the currently selected chat room.
    */ 
  async function postAction() {
    console.log(`ComposeMessagePScreen-noImages: postAction()`);
    const now = new Date();
    console.log(`ComposeMessagePScreen-noImages: now=${JSON.stringify(now)}`);    
    const dateString = now.toISOString();
    console.log(`ComposeMessagePScreen-noImages: dateString=${JSON.stringify(dateString)}`);        
    const newMessage = {
      'author': signedInUser?.email, 
      'dateString': dateString,
      'content': textInputValue, 
    }
    console.log(`ComposeMessagePScreen-noImages: newMessage=${JSON.stringify(newMessage)}`);
    await postMessage(newMessage); // Actually post the message to the current channel
    setTextInputValue(''); // clear text input for next time
    changePscreen('chat'); // navigate to chat screen after posting message (in next render)
  }

  return (
    <View style={styles.pscreen}>
      <TextInput
        multiline
        placeholder="message text goes here"
        style={styles.textInputArea}
        value={textInputValue} 
        onChangeText={setTextInputValue}
      />
      <View style={styles.buttonHolder}>
        <RNPButton title="Cancel" onPress={cancelAction}/>
        <RNPButton title="Post" onPress={postAction}/>
        </View>
      </View>
    );
  }

