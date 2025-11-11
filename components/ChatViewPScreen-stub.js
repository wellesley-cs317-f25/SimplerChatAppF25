

import { Text, View } from 'react-native';
import styles from '../styles';

export default function ChatViewPScreen( { changePscreen } ) {
  return (
    <View style={ styles.screen }>
      <Text>This is just a stub for a pseudoScreen that displays chat messages.</Text>  
    </View>
  );
  /*
  return (
    <>
    <View style={signedInUser?.emailVerified ? globalStyles.hidden : globalStyles.screen }>
      <Text>No user is logged in yet.</Text>
    </View>
    <View style={signedInUser?.emailVerified ? globalStyles.screen : globalStyles.hidden }>
      <Text>{signedInUser?.email} is logged in</Text>
      <Text>{`usingFirestore=${usingFirestore}`}</Text>
      <View style={globalStyles.buttonHolder}>
        <DebugButton visible={true} />
        <PopulateButton visible={true} />
        <ToggleStorageButton visible={true} />
        <RNPButton title="Compose Message" onPress={composeAction}
        />
      </View> 
      <DisplayMessagePane/>
    </View>
  </>
  );
  */
}


