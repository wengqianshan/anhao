import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import { list } from "../../utils/request";
import Context from "../../store/Context";

export default function List({ route, navigation }) {

  const { state, dispatch } = useContext(Context);

  // 数据请求状态
  const [loading, setLoading] = useState(false);

  // 下拉刷新状态
  const [refreshing, setRefresh] = useState(false);

  // 页码
  const [page, setPage] = useState(1);

  // 数据
  const [content, setList] = useState([]);

  // 请求数据
  const request = async () => {
    // 如果当前在 loading 状态，啥也不做
    if (loading) {
      return;
    }

    // 请求数据前设置 loading
    setLoading(true);

    const data = await list(page);

    // 请求数据结束关闭 loading
    setLoading(false);

    // 如果当前页码大于 1, 拼接内容
    if (page > 1) {
      return setList([...content, ...data]);
    }

    // 如果是下拉刷新, 关闭下拉刷新状态
    if (refreshing) {
      setRefresh(false);
    }

    // 当页面等于 1 时更新数据
    setList(data);
  };

  // 监听页面变化
  useEffect(() => {
    request();
  }, [page]);

  // 监听 host 变化
  useEffect(() => {
    if (page > 1) {
      return setPage(1);
    }
    request();
  }, [state.host]);

  // 监听下拉刷新
  useEffect(() => {
    // 如果是关闭下拉刷新, 啥也不做
    if (!refreshing) {
      return;
    }

    // 如果当前下拉刷新时页码大于 1, 直接更新页码, 进而触发数据请求
    if (page > 1) {
      return setPage(1);
    }

    //如果当前页码等于 1, 手动发请求
    request();
  }, [refreshing]);

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("Detail", {
            id: item._id,
            title: item.title,
          });
        }}
      >
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemTime}>{item.created}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  if (loading && !refreshing && page === 1) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>请稍等，精彩马上呈现...</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={content}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      style={styles.list}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        setPage(page + 1);
      }}
      onRefresh={() => {
        if (loading || refreshing) {
          return;
        }
        setRefresh(true);
      }}
      refreshing={refreshing}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 12,
    width: "100%",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 16,
  },
  itemTime: {
    color: "#999",
  },
});
