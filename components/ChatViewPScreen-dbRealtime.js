/**
 * This is a version of the ChatView pseudoScreen for SimplerChatApp that
 * illustrates reading chat messages from the firestore DB using Firestore's
 * realtime updates feature as described in
 *
 *   https://firebase.google.com/docs/firestore/query-data/listen
 *
 * It uses a combination of a query `where` clause and an onSnapshot listener
 * to minimize the number of chat messages read.
 * 
 * Like the pscreenDbFetch version, it also supports populating the
 * simpleMessages collection of the firestore db with fake messages;
 *
 */

import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RNPButton } from './RNPButton.js'; // Lyn's wrapper for react-native-paper button

import { db, // Need firestore db for this version
	 useSignedInUser // This is from authentication-only version 
       } from '../firebaseInit-authDb';
// Firestore operations (to store and read messages)
import { collection, doc, setDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import * as utils from '../utils';
import styles from '../styles';
import { testMessages } from '../fakeData';

/**
 * Properties:
 * 
 *   + visible (boolean) controls whether this pScreen is visible
 * 
 *   + changePscreen (string -> undefined function) changes the pScreen
 *       to the pScreen named by the string argument. 
 */
export default function ChatViewPScreen( { visible, changePscreen } ) {

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

  /**  Add a list of new messages add the end of allMessages */
  function addNewMessages(newMsgs) {
    setAllMessages( msgs => [...msgs, ...newMsgs] );     
  }

  /***************************************************************************
   CHAT CHANNEL/MESSAGE CODE
   ***************************************************************************/

   /**
   * useEffect is a hook for running code when either 
   *   1. The component is entered (created) or exited (destroyed)
   *   2. One of the state variables in the list of dependencies changes.
   *
   * This code uses onSnapshot to initially get all messages from the
   * simpleMessages collection when entering the ChatViewPScreen, but
   * then listen for "added" changes to automatically add to allMessages
   * any new messages posted by this user or other users. By minimizing
   * the reading of messages from the simpleMessages collection, this
   * helps to avoid the "quota exceeded" issues in less careful approaches.
   */

  useEffect(
    () => { 
      console.log('Entering ChatViewPScreen');
      let unsubscribe = () => undefined // "do nothing" nullary function
      // console.log(`In ChatViewPScreen-dbRealtime, signedInUser is ${JSON.stringify(signedInUser)}`);
      if (signedInUser != null) {
	const earliestDate = '1970-01-01T00:00:00.000Z' // same as (new Date(0)).toISOString()
	const latestMessageDate =
	  allMessages.length === 0 ? earliestDate :
	    allMessages[allMessages.length - 1].dateString
	const q = query(collection(db, 'simpleMessages'),
			// This where clause only retrieves messages more recent
			// than the last one in allMessages
			where('dateString', '>', latestMessageDate));
	unsubscribe = onSnapshot(q, (querySnapshot) => {
	  // onSnapshot establishes a listener on the firestore db that will be
	  // informed when new messages appear in the db. For more details, see
	  // 
	  //   https://firebase.google.com/docs/firestore/query-data/listen
	  const newMsgs = [] 
	  querySnapshot.docChanges().forEach((change) => {
	    // .docChanges listens for changes on the db. We care only when new
	    // messages are added, but other types are "removed" and "modified".
	    if (change.type === "added") {
	      newMsgs.push(docToMessage(change.doc))
	    }
	  });
	  // Add all new messages to end of allMessages state variable
	  // without re-reading earlier messages
	  addNewMessages(newMsgs)
	});
      }
      return () => {
        // Executed when exiting component
        console.log('Exiting ChatViewPScreen');
        unsubscribe();
      }
    },
    // If any of the following dependencies changes, execute effect again
    [signedInUser]
  ); 

  function docToMessage(msgDoc) {
    const data = msgDoc.data();
    console.log(`In docToMessage, reading message from db with contents ${JSON.stringify(data)}`);
    return msgDoc.data();
  }

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
          + " components/ChatViewPScreen-dbRealtime.js.\n"
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
          + " components/ChatViewPScreen-dbRealtime.js.");
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
    // 1console.log(`MesssageItem msg is ${JSON.stringify(msg)}`);
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
      <View
        // Using styles.hidden (with display 'none') and other styles is a more
        // robust way to hide/show views than using the pattern `boolean && View`    
        style={!visible ? styles.hidden :
  	         (signedInUser?.emailVerified ? styles.hidden
		                              : styles.pscreen) }
      >
        <Text>No user is logged in yet.</Text>
      </View>
      <View
        // Using styles.hidden (with display 'none') and other styles is a more
        // robust way to hide/show views than using the pattern `boolean && View`        
        style={!visible ? styles.hidden :
	         (signedInUser?.emailVerified ? styles.pscreen
		  : styles.hidden) }
      >
        <Text>{signedInUser?.email} is logged in</Text>
        <View style={styles.buttonHolder}>
          <DebugButton visible={true} />      
          <PopulateButton visible={true} />
          <RNPButton title="Compose Message" onPress={composeAction}/>
        </View> 
        <DisplayMessagePane/>
      </View>
    </>
  );
}




