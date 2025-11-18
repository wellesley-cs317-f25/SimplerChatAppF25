/**
 * This is a version of the ChatView pseudoScreen for SimplerChatApp that
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

import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RNPButton } from './RNPButton.js'; // Lyn's wrapper for react-native-paper button
import { db, // Need firestore db for this version
	 useSignedInUser // This is from authentication-only version 
       } from '../firebaseInit-authDb';
// Firestore operations (to store and read messages)
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import * as utils from '../utils';
import styles from '../styles';
import { testMessages } from '../fakeData';

/*
export default function ChatViewPScreen( { changePscreen } ) {
  const signedInUser = useSignedInUser();
  return (
    <View style={ styles.pscreen }>
      <Text style={ styles.pscreenText }>
      This is just a stub for a pseudoScreen that displays chat messages.
      {"\n"}
      { signedInUser?.email ?
	`The signed-in user's email is ${signedInUser?.email}.` :
	`No user is signed in.`}
      </Text>
    </View>
  );
  }
*/

export default function ChatViewPScreen( { changePscreen } ) {

  /**  
   * Elegant way to track signedInUser in any component.
   * signedInUser will be null until a user signs up or signs in. 
   * After a user signs up or signs in, can test: 
   *   + signedInUser?.email: email of user (undefined if signedInUser is null)
   *   + signedInUser?.verified: whether signedInUser is verified (undefined if signedInUser is null)
   */
  const signedInUser = useSignedInUser();

  /**  State variable for all message objects */
  const [allMessages, setAllMessages] = useState([]); 

  /***************************************************************************
   CHAT CHANNEL/MESSAGE CODE
   ***************************************************************************/

   /**
   * useEffect is a hook for running code when either 
   *   1. The component is entered (created) or exited (destroyed)
   *   2. One of the state variables in the list of dependencies changes.
   * 
   * This code gets messages for current channel when entering ChatViewPScreen.
   * This is *not* the best way to get messages, since it can lead to 
   * Firestore quota exceeded errors! We will see later how do use
   * onSnapshot to avoid this issue. 
   */


  /* 
  // Automatically update messages when signedInUser changes
  useEffect(
    () => { 
      console.log('Entering ChatViewPScreen');
      const q = query(collection(db, 'messages'), where('channel', '==', selectedChannel));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => docToMessage(doc));
        setSelectedMessages( messages );
        });
      
      return () => {
        // Executed when exiting component
        console.log('Exiting ChatViewPScreen');
        unsubscribe();
      }
    },
    // If any of the following dependencies changes, execute effect again
    [signedInUser]
    );
  */

  /*  
  useEffect(
    () => { 
      console.log('Entering ChatViewPScreen');
      async function fetchMessages () {
      // Executed when entering component
        const messages = await fetchAllMessages();
	
      }
      fetchMessages();
      return () => {
        // Executed when exiting component
        console.log('Exiting ChatViewPScreen');
      }
    },
    // If any of the following dependencies changes, execute effect again
    [signedInUser]
    );
  */

  /**
   * Button for displaying debugging information within app itself. 
   * This button is displayed only if the visible property is true. 
   */ 
  function DebugButton( {visible} ) {
    return (    
      visible &&	
      <RNPButton
        title='Debug'
        onPress={debug}
      />
    ); 
  }      
  
  /**
   * Action for the Debug button. 
   * Displays information about channels and messages. 
   * This is just an example of displaying debugging information; 
   * adapt it to your purposes.
   */ 
  async function debug() {
    console.log('Debug button has been pressed.');
    const debugObj = {
      signedInUser: signedInUser,
      allMessages: allMessages, 
    }
    alert("Below are values of relevant variables."
          + " You can remove this button by changing the value of"
          + " displayDebugButton from true to false near the top of"
          + " components/ChatViewScreen.js.\n"
          + utils.formatJSON(debugObj)); 
  }

  /**
   * Button for populating Firestore with a list of fake chat messages. 
   * This button is displayed only if the visible property is true.
   */ 
  function PopulateButton( {visible} ) {
    return (
      visible &&
      <RNPButton
        title="Populate Firestore"
        onPress={() => populateFirestoreDB(testMessages)}
      />
    );
  }

  /**
   * This is the action of the Populate button, which is only displayed
   * if displayPopulateButton is true. 
   *      
   * Populate Firestore with some initial test messages. 
   * Only need to call this *once*, *not* every time the app runs
   * (but it can be run multiple times without harm, since will
   * just overwrite each exiting message document with an exact copy).
   * 
   * This is just an example of populating Firestore with fake data;
   * adapt it to your purposes.
   */ 
  async function populateFirestoreDB(messages) {
    console.log('Populate Firestore button has been pressed.');    
    // Helper function that returns a promise to add a single
    // message document to the simpleMessages collection in firestore. 
    async function addMessageToDB(msg) {
      console.log(`addMessageToDB called with ${JSON.stringify(msg)}`);
      // human-readable ISO date string is so much more readable than
      // millisecond timer!
      // Add a new document in collection "simpleMessages" using
      // msg.dateString as the key for the doc
      return setDoc(doc(db, "simpleMessages", msg.dateString),
		    msg);
    }

    // Peform one await for all the promises. 
    await Promise.all(
      messages.map( addMessageToDB ) 
    );

    console.log('All test messsages successfully added to simpleMessages collection.');
    alert("Firestore has been populated with test messages."
          + " You can remove this button by changing the value of"
          + " displayPopulateButton from true to false near the top of"
          + " components/ChatViewPScreen-dbFetch.js.");
}

  /**
   * Button for fetching all message data from the simpleMessages collection. 
   * This button is displayed only if the visible property is true. 
   */ 
  function FetchButton( {visible} ) {
    return (
      visible &&
      <RNPButton
        title="Fetch All Messages From Firestore"
        onPress={() => fetchAllMessages()}
      />
    ); 
  }     

  /**
   * Get current messages for the given channel
   */ 
  async function fetchAllMessages() {
    console.log('fetching all messages from simpleMessages collection');
    const querySnapshot = await getDocs(collection(db, "simpleMessages"));
    const messages = [];
    querySnapshot.forEach(doc => {
      console.log(`querySnapshot.forEach has gotten doc ${JSON.stringify(doc)}`);      
      const msg = doc.data(); // Extract msg from the firestore doc
      console.log(`querySnapshot.forEach has gotten msg ${JSON.stringify(msg)}`);      
      messages.push(msg);
    });
    console.log(`fetching all messages: setAllMessages to ${JSON.stringify(messages)}`)
    setAllMessages(messages)
  }
			  
  /**
   * Open an area for message composition. Currently uses conditional formatting
   * (controlled by isComposingMessage state variabel) to do this within ChatViewScreen,
   * but really should be done by a Modal or separate screen. 
   */ 
  function composeAction() {
    changePscreen('compose');
  }

  /**
   * MessageItem is a simple component for displaying a single chat message
   */
  const MessageItem = ( { msg } ) => {
    console.log(`MesssageItem msg is ${JSON.stringify(msg)}`);
    return (
      <View style={styles.messageItem}>
        <Text style={styles.messageDateTime}>{utils.humanTime(msg.dateString)}</Text>
        <Text style={styles.messageAuthor}>{msg.author}</Text>
        <Text style={styles.messageContent}>{msg.content}</Text>
      </View> 
    ); 
  }

  function DisplayMessagePane() {
    return (
      <View style={styles.displayPane}>
        <Text style={styles.header}>Messages</Text> 
        {(allMessages.length === 0) ? 
          <Text>No messages to display</Text> :
          <FlatList style={styles.messageList}
         // reverse messages to show most recent first
             data={utils.reversed(allMessages)} 
             renderItem={ datum => <MessageItem msg={datum.item}></MessageItem>} 
             // keyExtractor extracts a unique key for each item, 
             // which removes warnings about missing keeys 
             keyExtractor={item => item.dateString} 
          />
        }
      </View>
    );
  }

  return (
    <>
      <View style={signedInUser?.emailVerified ? styles.hidden : styles.screen }>
        <Text>No user is logged in yet.</Text>
      </View>
      <View style={signedInUser?.emailVerified ? styles.screen : styles.hidden }>
        <Text>{signedInUser?.email} is logged in</Text>
        <View style={styles.buttonHolder}>
          <DebugButton visible={true} />      
          <PopulateButton visible={true} />
          <FetchButton visible={true} />      
          <RNPButton title="Compose Message" onPress={composeAction}/>
        </View> 
        <DisplayMessagePane/>
      </View>
    </>
  );
}




