/**
 * A version of SimplerChatApp with only stub screens that don't do anything.
 * This illustrate how to use pseudoScreens with SegmentedButtons and
 * RNPButtons (Lyn's abstraction over ReactNativePaper buttons).
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedButtons } from 'react-native-paper';
import SignInOutPScreen from './components/SignInOutPScreen-stub';
import ChatViewPScreen from './components/ChatViewPScreen-stub';

import styles from './styles';

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
          <SignInOutPScreen/>
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
