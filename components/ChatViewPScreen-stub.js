/**
 * This is just a stub for an ChatView pseudoScreen for SimplerChatApp
 * that just displays text saying it's a stub.
 */


import { Text, View } from 'react-native';
import styles from '../styles';

export default function ChatViewPScreen( { changePscreen } ) {
  return (
    <View style={ styles.pscreen }>
      <Text style={ styles.pscreenText }>
        This is just a stub for a pseudoScreen that displays chat messages.
      </Text>  
    </View>
  );
}


