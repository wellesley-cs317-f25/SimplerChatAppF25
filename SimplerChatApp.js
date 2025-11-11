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
              value: 'chat2',
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
