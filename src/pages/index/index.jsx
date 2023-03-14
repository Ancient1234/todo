import { useState } from "react";
import { View, Text, Input, Button, Checkbox, Label } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
// 记录todolist

import FlagSelector from "../../components/FlagSelector";
import "./index.less";

export default function Index() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [isEditing, setIsEditing] = useState(-1);
  const [editedTodo, setEditedTodo] = useState("");
  const [isHided, setIsHided] = useState(false);
  useLoad(() => {
    setTodoList(Taro.getStorageSync("todoList") || []);
  });

  // 把重复的操作拿出来
  const updateTodoList = (newList) => {
    setTodoList(newList);
    Taro.setStorage({
      key: "todoList",
      data: newList,
    });
  };

  const onInputTodo = (e) => {
    setTodo(e.currentTarget.value);
  };

  const onClickAdd = () => {
    const newList = [...todoList];
    // 更新todolist
    newList.push({
      content: todo,
      completedFlag: false,
      flag: "red",
    });
    // 更新todo为空字符串
    setTodo("");
    updateTodoList(newList);
  };

  const onClickEdit = (index) => {
    setIsEditing(index);
    setEditedTodo(todoList[index].content);
    // console.log("todo:" + todoList[index].content);
  };

  const inputChange = (e) => {
    // console.log("after click:" + editedTodo);
    let newEditedTodo = [...editedTodo];
    newEditedTodo = e.target.value;
    setEditedTodo(newEditedTodo);
  };
  const saveChange = (index) => {
    // console.log("after change:" + [...editedTodo]);
    const newList = [...todoList];
    newList[index].content = [...editedTodo];
    updateTodoList(newList);
    // console.log("newtodo:" + todoList[index].content);
    setIsEditing(-1);
  };

  const onClickDel = (index) => {
    const newList = [...todoList];
    newList.splice(index, 1);
    updateTodoList(newList);
  };

  const onClickFilter = () => {
    setIsHided(!isHided);
  };

  const onClickCheck = (index) => {
    const newList = [...todoList];
    newList[index].completedFlag = !newList[index].completedFlag;
    updateTodoList(newList);
  };

  const onChangeFlag = (flag, index) => {
    const newList = [...todoList];
    newList[index].flag = flag;
    newList[index].flagSelectorVisible = false;
    updateTodoList(newList);
  };

  const onClickIcon = (index) => {
    const newList = [...todoList];
    newList[index].flagSelectorVisible = true;
    updateTodoList(newList);
  };
  return (
    <View className="todo-page">
      <Input
        className="todo-Input"
        placeholder="New Todo"
        value={todo}
        onInput={onInputTodo}
      ></Input>
      <Button className="todo-add" onClick={onClickAdd}>
        Add Todo
      </Button>
      {todoList.length ? (
        <>
          <Text className="todo-title">TODOS</Text>
          {isHided ? (
            <Button className="show-cpltd" onClick={onClickFilter}>
              Show Completed
            </Button>
          ) : (
            <Button className="hide-cpltd" onClick={onClickFilter}>
              Hide Completed
            </Button>
          )}
          <View className="todo-box">
            {todoList.map((item, index) => (
              <View
                className="todo-item"
                key={index}
                style={{
                  display:
                    `${isHided}` === "true" && todoList[index].completedFlag
                      ? "none"
                      : "flex",
                }}
              >
                <Checkbox
                  checked={item.completedFlag}
                  onClick={() => onClickCheck(index)}
                ></Checkbox>

                {isEditing == index ? (
                  <>
                    <Input
                      className="todo-edit"
                      value={todoList[isEditing].content}
                      onChange={inputChange}
                    ></Input>
                    <Button
                      className="save-change"
                      onClick={() => saveChange(isEditing)}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Label
                    className={item.completedFlag ? "completed" : "uncompleted"}
                  >
                    <Text className="item-text">{item.content}</Text>
                  </Label>
                )}

                <View className="item-icon">
                  <Text
                    className="icon-flag"
                    style={{ color: item.flag }}
                    onClick={() => onClickIcon(index)}
                  ></Text>
                  {item.flagSelectorVisible && (
                    <FlagSelector
                      flag={item.flag}
                      onChange={(flag) => onChangeFlag(flag, index)}
                    />
                  )}
                </View>
                <Button
                  className="item-edit"
                  onClick={() => onClickEdit(index)}
                >
                  Edit
                </Button>
                <Button className="item-del" onClick={() => onClickDel(index)}>
                  Delete
                </Button>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

// export default class Index extends Component {
//   componentWillMount() {}

//   componentDidMount() {}

//   componentWillUnmount() {}

//   componentDidShow() {}

//   componentDidHide() {}

//   render() {
//     return (
//       <View className="index">
//         <Text>Hello world!</Text>
//       </View>
//     );
//   }
// }
