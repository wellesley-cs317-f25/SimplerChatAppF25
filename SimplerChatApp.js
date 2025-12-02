/**
 * This is the pscreenDbRealtime version of SimplerChatApp. It has a ChatView
 * pseudoscreen that illustrates reading chat messages from the firestore DB
 * using Firestore's realtime updates feature as described in
 *
 *   https://firebase.google.com/docs/firestore/query-data/listen
 *
 * Like the pscreenDbFetch version, it also supports populating the
 * simpleMessages collection of the firestore db with fake messages;
 *
 * The key differences between pscreenDbRealtime and pscreenDbFetch are:
 *
 * 1. PScreen visibility is *not* controlled by boolean expressions of the form
 *    `boolean && pscreen`. Instead, each pscreen component takes a boolean
 *    visibility prop that controls whether or not it is visible. It turns out
 *    that this is essential for the ChatView PScreen to maintain the content of 
 *    its local allMessages state variable when moving between pscreens. To see
 *    why, study the differences between Ex4 and Ex5 in
 * 
 *      https://snack.expo.dev/@fturbak/statetestswithcounters.
 *
 * 2. The ChatView PScreen uses a combination of a query `where` clause and an
 *    onSnapshot listener to minimize the number of chat messages read.
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedButtons } from 'react-native-paper';
import styles from './styles';
import { testMessages } from './fakeData';
import SignInOutPScreen from './components/SignInOutPScreen';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Modified and new imports for dbRealtime
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
import ChatViewPScreen from './components/ChatViewPScreen'; // supports images
import ComposeMessagePScreen from './components/ComposeMessagePScreen'; // supports images

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
      <SignInOutPScreen
         visible={pscreen === "login"}
         changePscreen={changePscreen}
      />
      <ChatViewPScreen
         visible={pscreen === "chat"}    
	 changePscreen={changePscreen}
      />
      <ComposeMessagePScreen
         visible={pscreen === "compose"}        
         changePscreen={changePscreen}
      />      
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
