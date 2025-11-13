/**
 * A version of SimplerChatApp with a stub ChatView pseudoscreen that
 * illustrates nonpersistent email/password authentication --- 
 * i.e., when the user closes the app when they're signed in,
 * they need to sign in again when the app relaunches 
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedButtons } from 'react-native-paper';
import ChatViewPScreen from './components/ChatViewPScreen-stub';
import styles from './styles';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Modified and new imports for nonpersistent authentication
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
import { auth } from './firebaseInit-nonPersistentAuth';
                        
// pscreen supporting actual authentication
import SignInOutPScreen from './components/SignInOutPScreen';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Code below is unchanged from pscreenStubs version *except* for
 * passing changePscreen property to SignInOutPScreen.
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export default function SimplerChatApp() {

  /** Current pseudoScreen to display */
  const [pscreen, setPscreen] = useState("login");

  function changePscreen(pscreenName) {
    console.log(`changing pscreen to ${pscreenName}`);
    setPscreen(pscreenName);
  }

  return (
    <SafeAreaView style={styles.container}>
      {pscreen === "login" &&
       <SignInOutPScreen changePscreen={changePscreen}/>
      }      
      { pscreen === "chat" &&
        <ChatViewPScreen/>
      }
      <View style={{width: '100%'}}>
        <SegmentedButtons
          style={styles.pscreenButtons}
          value={pscreen}
          onValueChange={changePscreen}
          buttons={[
            {
              value: 'login',
              label: 'Login',
            },
            {
              value: 'chat',
              label: 'Chat',
            },
          ]}
        />
      </View>
    </SafeAreaView>      
  );
}
