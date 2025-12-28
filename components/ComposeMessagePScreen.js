/**
 * Version of ComposeMessagePscreen that *does* support adding an image
 * to a chat message. 
 */

import { useState} from "react";
import { TextInput, View } from 'react-native';
import { RNPButton } from './RNPButton.js'; // Lyn's wrapper for react-native-paper button
import { useSignedInUser // hook for tracking whether user is signed in or not
       } from '../firebaseInit-authDb';
import { db, storage } from '../firebaseInit-authDbStorage';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from '../styles';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * new imports for dbRealtime-image
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
import ExpandableImage from './ExpandableImage.js'; // Lyn's ExpandableImage component
import * as ImagePicker from 'expo-image-picker';

/**
 * Properties:
 * 
 *   + visible (boolean) controls whether this pScreen is visible
 * 
 *   + changePscreen (string -> undefined function) changes the pScreen
 *       to the pScreen named by the string argument. 
 */
export default function ComposeMessagePScreen( {visible, changePscreen} ) {

  // Components with state variables need to be defined in separate files
  // rather than as helper components within other components. 
  // Otherwise the state variables will be reinitialized in unexpected ways.

  /** text value in input text area */
  const [textInputValue, setTextInputValue] = useState('');

  /** Device URI of single image that can be attached to message. */
  const [deviceImageUri, setDeviceImageUri] = useState(null);

  /**  
   * Elegant way to track signedInUser in any component.
   * signedInUser will be null until a user signs up or signs in. 
   * After a user signs up or signs in, can test: 
   *   + signedInUser?.email: email of user (undefined if signedInUser is null)
   *   + signedInUser?.verified: whether signedInUser is verified (undefined if signedInUser is null)
   */
    const signedInUser = useSignedInUser();

  /**
   * Cancel the current message composition. 
   * This is the action for the Cancel button in the message composition pane.
   */ 
  function cancelAction() {
    setDeviceImageUri(null);     
    changePscreen('chat'); // navigate back to chat screen
  }

  /**
   * Add an image to the message being composed. 
   * This is the action for the Add Image button in the message composition pane.
   * Currently, only one image can be added to a message; calling this
   * when there's already an image changes the image to be added. 
   * This behavior could be modified to support a *list* of an arbitrary
   * number of images. 
   */ 
  async function addImageAction () {
    await(pickImage());
  }

 /**
   * Pick an image from the device's image gallery and store it in 
   * the state variable deviceImageUri. 
   * For a simple demonstration of image picking, see the Snack 
   * https://snack.expo.dev/@fturbak/image-picker-example
   */ 
  async function pickImage () {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], // desired aspect ratio of images
      quality: 1,
    });
    
    console.log('Picked image:', result);
    
    if (!result.canceled) {
      // assets[0] has info about picked image;
      // assets[0].uri is its URI
      setDeviceImageUri(result.assets[0].uri);
    }
  };

  /**
    * Post a message to the the simpleMessages collecation
    */ 
  async function postAction() {
    console.log(`ComposeMessagePScreen: postAction()`);
    const now = new Date();
    console.log(`ComposeMessagePScreen: now=${JSON.stringify(now)}`);    
    const dateString = now.toISOString();
    console.log(`ComposeMessagePScreen: dateString=${JSON.stringify(dateString)}`);        
    const newMessage = {
      'author': signedInUser?.email, 
      'dateString': dateString,
      'content': textInputValue, 
    }
    try {
      if (deviceImageUri === null) {
        // Posting a message without an image is easy.	
	await firebasePostMessage(newMessage);	
      } else {
        // Posting a message with an image is more complicated. 
	await firebasePostMessageWithImage(deviceImageUri, newMessage);
      }      
      console.log(`ComposeMessagePScreen: message posted!`);
      setTextInputValue(''); // clear text input for next time
      setDeviceImageUri(null); // clear deviceImageUri for next time    
      changePscreen('chat'); // navigate to chat screen after posting message (in next render)
    } catch (error) {
      const errorMessage = error.message;
      console.log(`error when posting message ${errorMessage}`);
      alert(`error when posting message ${errorMessage}`);
    };
  }

  /**
   * Post a message msg *not* containing an image to Firebase's Firestore
   * by adding the msg object to the "simpleMmessages" collection. It is
   * expected that msg is a JavaScript object with required fields author,
   * dateString, and content. msg can *optionally* contain an imageURL field
   * added by firebastPostMessageWithImage (see below). 
   */ 
  async function firebasePostMessage(msg) {
    console.log(`firebasePostMessage ${JSON.stringify(msg)}`);
    await setDoc(
      doc(db, "simpleMessages", msg.dateString), // 1st argument is a doc object 
      msg // 2nd argument is the doc itself
    );
  }

  /**
   * Post a message msg that will contain an imageURL field  referencing
   * an image that will be uploaded to Firebase storage from deviceImageUri.
   * As for firebasePostMessage, it is expected that  msg is a JavaScript object
   * with fields author, dateString, and content. This function will add
   * to msg an additional field imageURL.
   * 
   * Posting a message with an image is more complicated than posting a message
   * without an image, because with an image we need to:
   * (1) upload the image from the device to Firebase storage (different
   *     than Firestore)
   * (2) get the downloadURL for the image in Firebase storage
   * (3) add to msg an imageURL field that contains the downloadURL
   * (4) post the msg-with-imageURL to Firestore (using firebasePostMessage).
   */ 
  async function firebasePostMessageWithImage(deviceImageUri, msg) {
    // Step 1: create a so-called storageRef, an abstraction location 
    // in Firebase's storage (different from Firestore!) where the
    // bits of the image will be stored.
    const dateString = msg.dateString
    const storageRef = ref(storage, `simplerChatImages/${dateString}`);

    // Step 2: convert the the image stored on the device at deviceImageUri
    // into a so-called Blob that can be uploaded to Firebase storage.
    // 
    // Lyn learned the next critical two lines of code from Bianca Pio and
    // Avery Kim's Goose app in F23: 
    const fetchResponse = await fetch(deviceImageUri);
    const imageBlob = await fetchResponse.blob();

    // Step 3: upload the image blob to Firebase storage.
    // uploadBytesResumable returns a Promise (here called uploadTask)
    // that receives state changes about upload progress that are here 
    // displayed in the console, but *could* be displayed in the app itself. 
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);
    console.log(`Uploading image for message with dateString ${dateString} ...`);
    uploadTask.on('state_changed',
      // This callback is called with a snapshot on every progress update
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded 
        // and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
            }
      }, 
      // This callback is called when there's an error in the upload
      (error) => {
        console.error(error);
      }, 

      // Step 4: This callback is called when the upload is finished
      // This step gets the downwloadURL of the image from Firebase storage,
      // stores this downloadURL in the imageURL field of msg, and uses
      // firebasePostMessage to post the msg to the Firestore DB
      async function() {
        console.log(`Uploading image for message with dateString ${dateString} succeeded!`);
        // Once the upload is finished, get the downloadURL for the uploaed image
        const downloadURL = await getDownloadURL(storageRef);
        console.log(`Image message with dateString ${dateString} is available at ${downloadURL}`);

        // add downloadURL to msg in field imageURL before storing it Firebase
        msg.imageURL = downloadURL;

        // Store (in Firestore) the message with the new imageURL field
        await firebasePostMessage(msg);
      }      
    ); // end arguments to uploadTask.on
  }
  
  return (
    <View style={visible ? styles.pscreen : styles.hidden}>    
      <TextInput
        multiline
        placeholder="message text goes here"
        style={styles.textInputArea}
        value={textInputValue} 
        onChangeText={setTextInputValue}
      />
      {// New for images. Conditionally display image if there is one: 
        deviceImageUri &&
        <ExpandableImage imageURL={deviceImageUri}/>
      }      
      <View style={styles.buttonHolder}>
        <RNPButton title="Cancel" onPress={cancelAction}/>
        <RNPButton title="Add Image"onPress={addImageAction}/>      
        <RNPButton title="Post" onPress={postAction}/>
        </View>
      </View>
    );
  }

