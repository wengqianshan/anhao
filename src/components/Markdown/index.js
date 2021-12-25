import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";
import { marked } from 'marked';
// https://marked.js.org/#/USING_PRO.md#parser
// # Block level tokenizer methods
// space(string src)
// code(string src, array tokens)
// fences(string src)
// heading(string src)
// nptable(string src)
// hr(string src)
// blockquote(string src)
// list(string src)
// html(string src)
// def(string src)
// table(string src)
// lheading(string src)
// paragraph(string src)
// text(string src, array tokens)
// # Inline level tokenizer methods
// escape(string src)
// tag(string src, bool inLink, bool inRawBlock)
// link(string src)
// reflink(string src, object links)
// strong(string src)
// em(string src)
// codespan(string src)
// br(string src)
// del(string src)
// autolink(string src, function mangle)
// url(string src, function mangle)
// inlineText(string src, bool inRawBlock, function smartypants)
/**
 * 根据 key 获取继承的样式名
 输入 list-list_item-list-list_item-text
 输出
  [
    "text",
    "list_item-text",
    "list-list_item-text",
    "list_item-list-list_item-text",
    "list-list_item-list-list_item-text"
  ];
 * @param {string} str
 */
function getClassNames(str) {
  const arr = str.split("-");
  const res = arr.reverse().reduce((prev, current) => {
    let res;
    if (!prev) {
      res = [current];
    } else {
      prev.push(`${current}-${prev[prev.length - 1]}`);
      res = prev;
    }
    return res;
  }, null);
  return res;
}

/**
 *
 * @param {object} token marked 格式化后的 token
 * @param {object} options 传入的配置，主要是父节点的信息
 type 父节点 type 如: text
 name 父节点 name, 如: heading1
 names 父节点继承的 name，如: heading1-text
 index 父节点的索引，如: 1
 indexes 父节点继承的索引，如: 1-0-0-1
 */
function render(
  token,
  { type: parentType, name: parentName, names, index, indexes, token: parentToken }
) {
  const { type, depth = "", text, title, href, tokens, items } = token;
  // console.log(parentType, parentName, names, index, indexes, parentToken);
  // name 表示标签唯一名, 如 heading1
  const name = type + depth;

  // 继承父标签的名字，如 heading3-text
  const nestName = names ? `${names}-${name}` : name;

  // 合并样式，依次: 默认 < type < type + depth < nest
  const style = {
    ...styles.base,
    ...styles[type],
  };
  const classNames = getClassNames(nestName);

  for (const className of classNames) {
    Object.assign(style, styles[className]);
  }

  let children = text;

  // 如果有子元素，返回循环渲染子元素
  if (tokens && tokens.length) {
    children = tokens.map((item, idx) => {
      return render(item, {
        token,
        type,
        name,
        index: idx,
        names: nestName,
        indexes: `${indexes}-${idx}`,
      });
    });
  }

  if (items && items.length) {
    children = items.map((item, idx) => {
      return render(item, {
        token,
        type,
        name,
        index: idx,
        names: nestName,
        indexes: `${indexes}-${idx}`,
      });
    });
  }

  // 定义视图
  let ComponentName = Text;
  const props = { style, key: indexes };

  // 根据节点类型渲染
  switch (type) {
    case "image":
      ComponentName = Image;
      const source = {
        uri: href,
        width: 300,
        height: 200,
      };
      children = null;
      Object.assign(props, {
        style: styles[type],
        source,
      });
      break;
    case "paragraph":
    case "blockquote":
    case "list":
      ComponentName = View;
      break;
    case "list_item":
      ComponentName = View;
      const len = (nestName.match(/list_item/g) || []).length;
      // 有序列表
      const { ordered } = parentToken || {};
      children = (
        <>
          {ordered ? (
            <View
              style={{
                ...styles["list_item-ordered"],
              }}
            >
              <Text>{index + 1}.</Text>
            </View>
          ) : (
            <View
              style={{
                ...styles["list_item-order"],
                ...styles[`list_item-order-${len}`],
              }}
            ></View>
          )}

          <View style={styles["list_item-content"]}>{children}</View>
        </>
      );
      break;
    case "code":
      ComponentName = View;
      children = (
        <Text selectable style={styles["code-text"]}>
          {children}
        </Text>
      );
      break;
    default:
  }
  const view = children ? (
    <ComponentName {...props}>{children}</ComponentName>
  ) : (
    <ComponentName {...props} />
  );
  return view;
}

export default function Markdown({ children }) {
  if (!children) {
    return null;
  }
  const tokens = marked.lexer(children);
  // console.log(tokens);
  const items = tokens.map((item, index) => {
    return <Fragment key={index}>{render(item, {index})}</Fragment>;
  });
  return (
    <View style={styles.container}>
      {items}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  base: {
    // fontSize: 16,
    color: "#333",
  },
  text: {
    // fontSize: 16,
  },
  code: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#333",
    marginBottom: 16,
    width: 340,
  },
  "code-text": {
    color: "#eee",
    fontSize: 16,
  },
  paragraph: {
    marginBottom: 16,
  },
  "paragraph-html": {
    fontSize: 16,
    lineHeight: 20,
    backgroundColor: "#089",
  },
  "paragraph-text": {
    fontSize: 16,
    lineHeight: 20,
  },
  "paragraph-em": {
    fontStyle: "italic",
  },
  "paragraph-em-text": {
    fontSize: 16,
    lineHeight: 20,
  },
  "paragraph-del-text": {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
  },
  "paragraph-strong-text": {
    fontSize: 16,
    lineHeight: 20,
  },
  "paragraph-strong-em-text": {
    fontSize: 16,
    lineHeight: 20,
    fontStyle: "italic",
  },
  "paragraph-link-text": {
    color: "#00f",
    fontSize: 16,
    lineHeight: 20,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#eee",
    paddingLeft: 10,
    marginBottom: 16,
  },
  "blockquote-paragraph": {
    marginTop: 10,
    marginBottom: 10,
  },
  "blockquote-paragraph-text": {
    color: "#888",
    fontSize: 16,
    lineHeight: 20,
  },
  "blockquote-paragraph-codespan": {
    backgroundColor: "#ff7500",
    fontSize: 16,
    color: "#fff",
  },
  "blockquote-paragraph-link-text": {
    color: "#00f",
    fontSize: 16,
    lineHeight: 20,
  },
  image: {},
  heading: {
    marginBottom: 16,
    marginTop: 16,
    fontWeight: "bold",
  },
  heading1: {
    fontSize: 32,
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 24,
    fontWeight: "bold",
  },
  heading3: {
    fontSize: 20,
    fontWeight: "bold",
  },
  heading4: {
    fontSize: 18,
    fontWeight: "bold",
  },
  heading5: {
    fontSize: 14,
    fontWeight: "bold",
  },
  heading6: {
    fontSize: 12,
    fontWeight: "bold",
  },
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  space: {
    // height: 1,
    // backgroundColor: "#008",
  },
  link: {
    color: "#00f",
  },
  list: {
    marginBottom: 10,
    marginTop: 10,
  },
  list_item: {
    flexDirection: "row",
  },
  "list_item-ordered": {
    marginTop: 4,
    marginRight: 8,
  },
  "list_item-order": {
    backgroundColor: "#999",
    width: 6,
    height: 6,
    marginTop: 9,
    marginRight: 8,
  },
  "list_item-order-1": {
    backgroundColor: "#333",
    borderRadius: 3,
  },
  "list_item-order-2": {
    backgroundColor: "#fff",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 3,
  },
  "list_item-order-3": {
    backgroundColor: "#333",
  },
  "list_item-content": {},
  "list-list_item": {},
  "list-list_item-text": {
    fontSize: 16,
    lineHeight: 24,
  },
  "list-list_item-text-link": {},
  "list-list_item-text-link-text": {
    fontSize: 16,
    color: "#00f",
  },
  "list-list_item-text-html": {
    color: "#f00",
  },
});
