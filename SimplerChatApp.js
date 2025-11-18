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
import { db } from './firebaseInit-authDb';
import { doc, setDoc } from "firebase/firestore";

import ChatViewPScreen from './components/ChatViewPScreen-dbFetch';
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
  const [allMessages, setAllMessages] = useState([]); 

  function changePscreen(pscreenName) {
    console.log(`changing pscreen to ${pscreenName}`);
    setPscreen(pscreenName);
  }

  /**
   * @param {string} msg 
   * 
   * Post a message to Firebase's Firestore by adding a new document
   * for the message in the "simpleMessages" collection. It is expected that 
   * msg is a JavaScript object with fields date, author, and content.
   */ 
  async function firestorePostMessage(msg) {
    console.log(`firebasePostMessage ${JSON.stringify(msg)}`);    
    const dateString = msg.dateString // ISO time string
    console.log(`firebasePostMessage dateString is ${JSON.stringify(dateString)}`);          
    await setDoc(
      doc(db, "simpleMessages", dateString), // 1st argument is a doc object 
      msg // 2nd argument is the doc itself
    );
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
        <ComposeMessagePScreen 
          changePscreen={changePscreen}
          postMessage={firestorePostMessage}
        />
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
