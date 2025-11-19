/**
 * A version of SimplerChatApp with a simple ChatView pseudoscreen that
 * illustrates storing and reading chat messages from the firestore db.
 * It supports:
 * 
 *   1. Populating the simpleMessages collection of the firsetore db
 *      with fake messages; 
 *
 *   2. Explicitly fetching all messages from the simpleMessages collection,
 *      WHICH IS A REALLY BAD IDEA because each fetch operation of all
 *      messages can consume a significant part of the daily quota for reading
 *      messages. See how to avoid this in the pscreenDbRealtime branch.
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedButtons } from 'react-native-paper';
import styles from './styles';
import SignInOutPScreen from './components/SignInOutPScreen';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Modified and new imports for dbFetch
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
import ChatViewPScreen from './components/ChatViewPScreen-dbRealtime';
import ComposeMessagePScreen from './components/ComposeMessagePScreen-noImages.js';
import { testMessages } from './fakeData';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Code below is unchanged from pscreenStubs version *except* for
 * passing changePscreen property to SignInOutPScreen.
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export default function SimplerChatApp() {

  /** Current pseudoScreen to display */
  const [pscreen, setPscreen] = useState("login");

  /**  State variable for all message objects */
  // const [allMessages, setAllMessages] = useState([]); 

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
        <ChatViewPScreen changePscreen={changePscreen}/>
      }
      { pscreen === "compose" &&
        <ComposeMessagePScreen changePscreen={changePscreen}/>
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
          // Don't have option for compose ... 
        />
      </View>
    </SafeAreaView>      
  );
}
