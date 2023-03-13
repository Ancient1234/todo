import { useState, Menu } from "react";
import {
  View,
  Text,
  Input,
  Button,
  Checkbox,
  Icon,
  Label,
} from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
// 记录todolist

import FlagSelector from "../../components/FlagSelector";
import "./index.less";

export default function Index() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [isEditing, setIsEditing] = useState(-1);
  const [editedTodo, setEditedTodo] = useState("");
  const [isFilted, setIsFilted] = useState(false);
  useLoad(() => {
    setTodoList(Taro.getStorageSync("todoList") || []);
  });

  // 把重复的操作单独拎出来
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
    // newList.push(todo);
    // 更新todolist
    newList.push({
      content: todo,
      completedFlag: false,
      flag: "red",
    });
    setTodo("");
    updateTodoList(newList);
  };

  const onClickEdit = (index) => {
    setIsEditing(index);
    // 先把当前todo复制到editedTodo里面
    setEditedTodo(todoList[index].content);
    console.log("todo:" + todoList[index].content);
    // console.log("after click:" + editedTodo);
    // console.log("after click:" + editedTodo.content);
    // undifined

    // console.log(todoList[index].content.join());
    // console.log("after click:" + [...editedTodo]);
    // console.log(todoList[index].content.join(","));
    // console.log(todoList[index].completedFlag);
    // setEditedTodo("124");
  };

  const inputChange = (e) => {
    console.log("after click:" + editedTodo);
    let newEditedTodo = [...editedTodo];
    newEditedTodo = e.target.value;
    setEditedTodo(newEditedTodo);
    // console.log("after change:" + newEditedTodo);

    // setTodo(newEditedTodo);
  };
  const saveChange = (index) => {
    // inputChange(e);
    console.log("after change:" + [...editedTodo]);
    const newList = [...todoList];
    newList[index].content = [...editedTodo];
    updateTodoList(newList);
    console.log("newtodo:" + todoList[index].content);
    setIsEditing(-1);
  };

  const onClickDel = (index) => {
    const newList = [...todoList];
    newList.splice(index, 1);
    updateTodoList(newList);
  };

  const onClickFilter = () => {
    setIsFilted(!isFilted);
    // const newList = [...todoList];
    // newList.map((item, index) => {
    //   if (todoList[index].completedFlag) newList.push(todoList[index].content);
    // });
    // for (let index in newList) {
    //   if (newList[index].completedFlag) newList.splice(index, 1);
    // }
    // newList.map((item, index) => {
    //   newList.splice(index, 1);
    // });
    // newList.splice(index, 1);
    // console.log
    // console.log(!`${isFilted}`);
    // console.log(`${isFilted}`.valueOf());
    // console.log(!`${isFilted}` ? "hidden" : "visible");
    // updateTodoList(newList);
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
      {/* <h1 className="page-title">TODO LIST</h1> */}
      {/* 不兼容小程序 */}
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
          <Button className="filter" onClick={onClickFilter}>
            {/* filter后面有括号也报错👿 */}
            Filter Completed
          </Button>
          <menu>ss</menu>
          {/* <Select
            className="selectFilter"
            // id="status"
            // value={filterStatus}
            // onChange={updatedFilter}
          >
            <option value="all">All</option>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </Select> */}
          <View className="todo-box">
            {todoList.map((item, index) => (
              <View
                className="todo-item"
                key={index}
                style={{
                  display:
                    `${isFilted}` === "true" && todoList[index].completedFlag
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

// 优化点：如果是空输入

//   return (
//     <View className="todo-page">
//       <Input className="todo-Input" placeholder="输入todo" value={todo}>
//         OnInput={onInputTodo}
//       </Input>
//       <Button className="todo-add" onClick={onClickAdd}>
//         添加TODO
//       </Button>
//       {todoList.length ? (
//         // 如果length>0 显示下面的布局，否则不显示
//         <>
//           <Text className="todo-title">TODOs</Text>
//           <View className="todo-box">
//             {todoList.map((item, index) => (
//               <View className="todoitem" key={index}>
//                 {/* <Checkbox></Checkbox> */}
//                 {/* 没明白 */}
//                 <Text className="item-text">{item.content}</Text>
//                 <Button className="item-del">
//                   onClick={() => onClickDel(index)}删除
//                 </Button>
//               </View>
//               // 直接渲染一个view来放置写好的todolist
//             ))}
//           </View>
//         </>
//       ) : null}
//     </View>
//   );
// }
// export default function Index() {
//   const [todo, setTodo] = useState("23333....");
//   const [todoList, setTodoList] = useState(["123", "234", "345"]);
//   return (
//     <View className="index">
//       <Input value={todo}></Input>
//       <Button>添加</Button>
//       {todoList.map((item, index) => (
//         <View className="todoitem" key={index}>
//           <Text>{item}</Text>
//         </View>
//       ))}
//     </View>
//   );
// }
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
