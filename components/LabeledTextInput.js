import { Text, TextInput, View } from 'react-native';
import styles from '../styles';

export default function LabeledTextInput (
  { label,
    placeholder,
    textState,
    defaultValue,
    onChangeText,
    keyboardType
  }
  ) {
  return (
      <View style={styles.labeledInput}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
           style={styles.textInput}
           placeholder={placeholder}
           value={textState}
           defaultValue={defaultValue}    
           // defaultValue={defaultValue === '' ? undefined : defaultValue}
           // No need to have following line or `email` property, 
           // be automatically updated correctly by default:
           // value={email}
           onChangeText={onChangeText}
           // Helpful settings from CS317 F23 final project team TasteBuds:
           // 
           // Note: keyboard type can be one of the following: 
           // default, number-pad, decimal-pad, numeric, email-address, phone-pad, url
           keyboardType={keyboardType}
           autoCorrect={false}
           autoCapitalize='none'
           autoComplete='off'
          /> 
      </View>
  );
}
