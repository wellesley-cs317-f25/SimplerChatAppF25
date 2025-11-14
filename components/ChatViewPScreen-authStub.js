/**
 * This is just a stub for an ChatView pseudoScreen for SimplerChatApp
 * that just displays text saying it's a stub.
 */

import { Text, View } from 'react-native';
import styles from '../styles';

import { useSignedInUser } from '../firebaseInit-nonPersistentAuth';

export default function ChatViewPScreen() {
  const signedInUser = useSignedInUser();
  return (
    <View style={ styles.pscreen }>
      <Text style={ styles.pscreenText }>
      This is just a stub for a pseudoScreen that displays chat messages.
      {"\n"}
      { signedInUser?.email ?
	`The signed-in user's email is ${signedInUser?.email}.` :
	`No user is signed in.`}
      </Text>
    </View>
  );
}


