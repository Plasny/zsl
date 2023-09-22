import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions } from 'react-native';

const NumBtn = (props) => {
  const flex = props.flex ? props.flex : 1;
  const fn = props.xFn ? props.xFn : () => props.fn(props.num)

  return (
    <TouchableHighlight 
      style={[s.numBtn, {flex: flex}]}
      onPress={fn}
    >
      <Text style={s.numText}>{props.num}</Text>
    </TouchableHighlight>
  )
}

const FnBtn = (props) => {
  const flex = props.flex ? props.flex : 1;
  const fn = props.xFn;

  return (
    <TouchableHighlight 
      style={[s.fnBtn, {flex: flex}]}
      onPress={fn}
    >
      <Text style={s.fnText}>{props.symbol}</Text>
    </TouchableHighlight>
  )
}

export default function App() {
  const getOrientation = () => {
    let dim = Dimensions.get('screen');
    if (dim.height >= dim.width) {
      return "portrait"
    }
    return "landscape"
  };

  const [orientation, setOrientation] = useState(getOrientation());
  const [operationStr, setOperationStr] = useState("");
  const [resultStr, setResultStr] = useState("");

  Dimensions.addEventListener("change", () => {
    setOrientation(getOrientation())
  })

  const performOp = (str) => {
    setOperationStr(operationStr + str);
  }

  const clearAll = () => {
    setOperationStr("");
    setResultStr("");
  }

  const clearLast = () => {
    setOperationStr(operationStr.slice(0, -1));
  }

  const addDot = () => {
    let ok = true;
    for(const char of operationStr) {
      if (char == ".") ok = false
      if (["%", "/", "*", "-", "+"].includes(char)) ok = true
    }

    if(ok) setOperationStr(operationStr + ".");
  }

  const addSym = (sym) => {
    if(["%", "/", "*", "-", "+", "."].includes(operationStr[operationStr.length - 1])) {
      let newStr = operationStr.slice(0, operationStr.length - 1) + sym;
      setOperationStr(newStr);
    } else {
      setOperationStr(operationStr + sym);
    }
  }
  
  const happyFace = () => {
    setResultStr("😁");
  }

  // parse string and perform operations on numbers
  const calculate = (show = true) => {
    const numbers = operationStr
          .split(/[\+\-\/\*]/)
          .map(str => parseFloat(str))
          .filter(num => !isNaN(num))
    const operations = operationStr
          .replaceAll(/[0-9\.]/g, "")
          .split("")

    let result = numbers[0]

    // console.log("numLen:", numbers.length)
    // console.log("num:", numbers)
    for(let i = 1; i < numbers.length; i++) {
      // console.log(i, numbers[i], operations[i - 1])
      switch(operations[i - 1]) {
        case "+":
          result += numbers[i]
          break
        case "-":
          result -= numbers[i]
          break
        case "/":
          result /= numbers[i]
          break
        case "*":
          result *= numbers[i]
          break
      }
    }

    if(show) {
      setResultStr(result)
    }
    return result;
  }

  const sin = () => {
    const num = calculate(false)
    setResultStr(Math.sin(num))
  }
  const cos = () => {
    const num = calculate(false)
    setResultStr(Math.cos(num))
  }
  const tg = () => {
    const num = calculate(false)
    setResultStr(Math.tan(num))
  }
  const pow = () => {
    const num = calculate(false)
    setResultStr(Math.pow(num, 2))
  }
  const sqrt = () => {
    const num = calculate(false)
    setResultStr(Math.sqrt(num))
  }

  if (orientation == "portrait") {
    return (
      <View style={s.container}>
        <StatusBar style="auto" />
        <View style={s.operationStr}>
            <Text style={s.numText}>{operationStr}</Text>
        </View>
        <View style={s.result}>
            <Text style={s.numText}>{resultStr}</Text>
        </View>
        <View style={s.numpad}>
          <View style={s.numpadRow}>
            <FnBtn symbol="AC" xFn={clearAll} />
            <FnBtn symbol="C" xFn={clearLast} />
            <FnBtn symbol="😁" xFn={happyFace} />
            <FnBtn symbol="*" xFn={() => addSym("*")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={7} fn={performOp} />
            <NumBtn num={8} fn={performOp} />
            <NumBtn num={9} fn={performOp} />
            <FnBtn symbol="/" xFn={() => addSym("/")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={4} fn={performOp} />
            <NumBtn num={5} fn={performOp} />
            <NumBtn num={6} fn={performOp} />
            <FnBtn symbol="+" xFn={() => addSym("+")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={1} fn={performOp} />
            <NumBtn num={2} fn={performOp} />
            <NumBtn num={3} fn={performOp} />
            <FnBtn symbol="-" xFn={() => addSym("-")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={0} flex={2} fn={performOp} />
            <NumBtn num="." xFn={addDot} />
            <FnBtn symbol="=" xFn={calculate} />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={s.container}>
        <StatusBar style="auto" />
        <View style={s.operationStr}>
            <Text style={s.numText}>{operationStr}</Text>
        </View>
        <View style={s.result}>
            <Text style={s.numText}>{resultStr}</Text>
        </View>
        <View style={s.numpad}>
          <View style={s.numpadRow}>
            <FnBtn symbol="AC" xFn={clearAll} />
            <FnBtn symbol="C" xFn={clearLast} />
            <FnBtn symbol="😁" xFn={happyFace} />
            <FnBtn symbol="pow" xFn={pow} />
            <FnBtn symbol="*" xFn={() => addSym("*")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={7} fn={performOp} />
            <NumBtn num={8} fn={performOp} />
            <NumBtn num={9} fn={performOp} />
            <FnBtn symbol="sqrt" xFn={sqrt} />
            <FnBtn symbol="/" xFn={() => addSym("/")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={4} fn={performOp} />
            <NumBtn num={5} fn={performOp} />
            <NumBtn num={6} fn={performOp} />
            <FnBtn symbol="sin" xFn={sin} />
            <FnBtn symbol="+" xFn={() => addSym("+")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={1} fn={performOp} />
            <NumBtn num={2} fn={performOp} />
            <NumBtn num={3} fn={performOp} />
            <FnBtn symbol="cos" xFn={cos} />
            <FnBtn symbol="-" xFn={() => addSym("-")} />
          </View>
          <View style={s.numpadRow}>
            <NumBtn num={0} flex={2} fn={performOp} />
            <NumBtn num="." xFn={addDot} />
            <FnBtn symbol="tg" xFn={tg} />
            <FnBtn symbol="=" xFn={calculate} />
          </View>
        </View>
      </View>
    )
  }
}

const s = StyleSheet.create({
  operationStr: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    paddingLeft: 5,
    backgroundColor: '#cee5f2',
  },
  result: {
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    paddingLeft: 5,
    backgroundColor: '#accbe1',
  },
  numpad: {
    width: '100%',
    padding: 5,
    backgroundColor: '#7c98b3',
    flex: 1,
    flexDirection: 'column',
  },
  numpadRow: {
    grow: 1,
    flex: 1,
    flexDirection: 'row',
  },
  numBtn: {
    margin: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#accbe1',
  },
  fnBtn: {
    margin: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#464655',
  },
  numText: {
    fontSize: 30,
  },
  fnText: {
    fontSize: 30,
    color: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
