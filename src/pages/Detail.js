import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { detail, delDetail } from "../utils/request";
import Context from '../store/Context';

import Markdown from '../components/Markdown';
import Gallery from '../components/Gallery';

const { width } = Dimensions.get("window");

export default function Detail({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const { state, dispatch } = useContext(Context);

  const { id } = route.params || {};
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 内容
  const [content, setContent] = useState({});
  // 当前播放索引
  const [playing, setPlaying] = useState(-1);

  // 切换播放项
  useEffect(() => {
    const { gallery = [] } = content || {};
    const data = gallery.map((item, index) => {
      return {
        ...item,
        playing: index === playing,
      };
    });
    setContent({
      ...content,
      gallery: data,
    });
  }, [playing]);

  // 默认数据加载
  useEffect(() => {
    const request = async () => {
      const data = await detail(id);
      // console.log(data);
      setLoading(false);
      setContent(data || {});
    };
    request();
  }, []);

  // 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => state.userToken ? (
        <TouchableOpacity
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onPress={async () => {
            await delDetail(id);
            navigation.goBack();
          }}
        >
          <Text>
            删除
          </Text>
        </TouchableOpacity>
      ) : null,
    });
  }, [navigation]);
  const { gallery = [] } = content || {};
  return (
    <View style={styles.layout}>
      <ScrollView>
        <View
          style={{
            ...styles.content,
            paddingBottom: insets.bottom,
            paddingTop: insets.top + 44,
          }}
        >
          {/* <Video
            key={`89955-video`}
            source={{
              uri: "http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8",
            }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            useNativeControls={false}
            shouldPlay
            style={{
              width: width,
              height: 200,
              backgroundColor: "#000",
              marginBottom: 12,
              marginLeft: -16,
            }}
          /> */}
          {loading ? <Text>Loading</Text> : null}
          <Gallery
            items={gallery}
            onItemClick={(index) => {
              setPlaying(index);
            }}
          />
          <Markdown>{content.content}</Markdown>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    alignItems: "flex-start",
  },
});