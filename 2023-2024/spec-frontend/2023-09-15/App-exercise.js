import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const size = 5;
  const colors = [
      s.red, s.green, s.blue
  ];

  const cols = [];

  for (let i = 0; i < size; i++) {
      const cells = [];
      for (let j = 0; j < size; j++) {
          const colorIdx = (j + i) % colors.length;
          cells[j] = (
            <View style={[s.cell, colors[colorIdx]]} key={i+j}>
              <Text style={s.text}>{colorIdx + 1}</Text>
            </View>
          );
      }
      cols[i] = (
        <View style={s.col} key={i}>
          {cells}
        </View>
      );
  }
  return (
    <View style={s.container}>
      {cols}
    </View>
  );
}

const s = StyleSheet.create({
  red: {
      backgroundColor: "#f00",
  },
  green: {
      backgroundColor: "#0f0",
  },
  blue: {
      backgroundColor: "#00f",
  },
  col: {
    flex: 1,
    flexDirection: 'column',
  },
  cell: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  },
  text: {
      fontSize: 30,
      color: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
});
