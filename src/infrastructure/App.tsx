import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { CompositionRoot } from './CompositionRoot';

const compositionRoot = new CompositionRoot();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>HexaBlock</Text>
      <Text>{compositionRoot.modeRegistry.findAll().length} game modes available</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
