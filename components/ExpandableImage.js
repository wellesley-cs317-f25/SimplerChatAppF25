import { Dimensions, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { RNPButton } from './RNPButton';
import { useState } from "react";

const { width, height } = Dimensions.get("window");
const bigImageSize = 0.95*Math.min(width, height);

export default function ExpandableImage({imageURL}) {

  // Manages Modal State
  const [isModalVisible, setModalVisible] = useState(false);

  function openModalImage() {
    setModalVisible(true);
  }

  function closeModalImage() {
    setModalVisible(false);
  }  

  return (
   <>
   <Pressable
      style={localStyles.pressableThumbnail}
      onPress={openModalImage}
    >  
      <Image
        style={localStyles.thumbnail}
        source={{uri: imageURL}}
      />
    </Pressable>
    {/* This is our modal component containing textinput and a button */}
    <Modal animationType="slide" 
           transparent visible={isModalVisible} 
           presentationStyle="overFullScreen" 
           onDismiss={closeModalImage}>
      <View style={localStyles.modalViewWrapper}>
        <View style={localStyles.modalView}>
	  <Image
	    style={localStyles.bigImage}
            source={{uri: imageURL}}	    
	  />
	  <RNPButton title='Close' onPress={closeModalImage}/>
	</View>
      </View>	
    </Modal>
    </>
  );

}

const localStyles = StyleSheet.create({
  modalViewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "15%",
    left: "1.5%",
    elevation: 5,
    height: bigImageSize+70,
    width: bigImageSize+10,
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: 'black',
  },
  pressableThumbnail: {
    width: 96,
    height: 96,
    borderWidth: 3,
    borderColor: 'blue',
    margin: 10
  },
  bigImage: {
    width: bigImageSize,
    height: bigImageSize,
  },
  thumbnail: {
    width: 90,
    height: 90,
  },
});
