import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

import { Video } from "expo-av";

import { host } from "../../utils/request";
import IconFont from "../../iconfont";

const { width } = Dimensions.get("window");

export default function Gallery(props) {
  const { items = [], onItemClick } = props;
  return (
    <View>
      {items.map((item, index) => {
        const { covers, type, url, playing = false, width: w, height: h } = item || {};
        const height = h * width / w;
        if (/video/.test(type)) {
          return playing ? (
            <Video
              key={`${item._id}-video`}
              source={{ uri: `${host}${url}` }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              useNativeControls
              shouldPlay
              style={{
                width: width,
                height: height,
                backgroundColor: "#000",
                marginBottom: 12,
                marginLeft: -16,
              }}
            />
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                // setPlaying(index);
                onItemClick(index);
              }}
              key={item._id}
              style={{
                position: "relative",
              }}
            >
              <View>
                <Image
                  style={{
                    width: width,
                    height: height,
                    marginBottom: 12,
                    marginLeft: -16,
                  }}
                  resizeMode="cover"
                  source={{
                    uri: `${host}${covers[0]}`,
                  }}
                />
                <IconFont style={styles.playIcon} color="#666" size={32} name="videofill" />
              </View>
            </TouchableWithoutFeedback>
          );
        } else {
          return (
            <Image
              key={item._id}
              style={{
                width: width,
                height: height,
                marginBottom: 12,
                marginLeft: -16,
              }}
              resizeMode="cover"
              source={{
                uri: `${host}${url}`,
              }}
            />
          );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#fff",
  },
  playIcon: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -16,
    marginTop: -16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, .8)',
    borderRadius: 16,
    color: '#f00'
  },
});
