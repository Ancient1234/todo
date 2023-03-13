import { View, Text } from "@tarojs/components";
import classnames from 'classnames'
import './index.scss'

export default function FlagSelector({
  flag,
  onChange
}) {
  const flagList = ['', 'red', 'yellow', 'green', 'gray']

  return <View className='flag-selector'>
    {flagList.map((item, index) =>
      <Text
        className={classnames('icon-flag', { cur: flag === item })}
        key={index}
        style={{ color: item }}
        onClick={() => onChange(item)}
      ></Text>)}
  </View>

}
