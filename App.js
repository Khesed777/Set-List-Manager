import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
  Keyboard,
  LayoutAnimation,
  UIManager,
  Dimensions,
} from 'react-native';

const Background = ({ children }) => (
  <View style={[styles.background, { backgroundColor: '#87CEEB' }]}>
    {children}
  </View>
);

const screenHeight = Dimensions.get('window').height;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [unusedSongs, setUnusedSongs] = useState([]);
  const [usedSongs, setUsedSongs] = useState([]);
  const [input, setInput] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const addSong = () => {
    if (input.trim() === '') return;
    setUnusedSongs((prev) => [...prev, input.trim()]);
    setInput('');
  };

  const moveToUsed = (index) => {
    const song = unusedSongs[index];
    setUnusedSongs((prev) => prev.filter((_, i) => i !== index));
    setUsedSongs((prev) => [...prev, song]);
  };

  const resetUsedToUnused = () => {
    setUnusedSongs((prev) => [...prev, ...usedSongs]);
    setUsedSongs([]);
  };

  const showResetButton = unusedSongs.length === 0 && usedSongs.length > 0;

  const TITLE_BOX_HEIGHT = 80;
  const INPUT_CONTAINER_HEIGHT = 60;
  const RESET_BUTTON_HEIGHT = showResetButton ? 60 : 0;
  const PADDING = 40; 
  
  const availableHeight =
    screenHeight -
    keyboardHeight -
    TITLE_BOX_HEIGHT -
    INPUT_CONTAINER_HEIGHT -
    RESET_BUTTON_HEIGHT -
    PADDING;

  
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [keyboardHeight, showResetButton]);

  useEffect(() => {
    const onKeyboardShow = (e) => setKeyboardHeight(e.endCoordinates.height);
    const onKeyboardHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          enabled
        >
          {/* Title box */}
          <View style={styles.titleBox}>
            <Text style={styles.title}>Setlist Manager</Text>
          </View>

          {/* Lists container with dynamic height */}
          <View style={[styles.listsContainer, { height: availableHeight }]}>
            {/* Unused Songs List */}
            <View style={[styles.listBox, { backgroundColor: '#fff', borderColor: '#000' }]}>
              <Text style={styles.listTitle}>Set List</Text>
              <FlatList
                data={unusedSongs}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={styles.songItem} onPress={() => moveToUsed(index)}>
                    <Text style={styles.songText}>{item}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No unused songs</Text>}
              />
            </View>

            {/* Used Songs List */}
            <View style={[styles.listBox, { backgroundColor: '#ccc', borderColor: '#666' }]}>
              <Text style={styles.listTitle}>Used Songs</Text>
              <FlatList
                data={usedSongs}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.songItem}>
                    <Text style={styles.songText}>{item}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No used songs</Text>}
              />
            </View>
          </View>

          {/* Reset button */}
          {showResetButton && (
            <TouchableOpacity style={styles.resetButton} onPress={resetUsedToUnused} activeOpacity={0.8}>
              <Text style={styles.resetButtonText}>Reset Used Songs to Set List</Text>
            </TouchableOpacity>
          )}

          {/* Input container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter song"
              placeholderTextColor="#b0b0b0"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={addSong}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={addSong}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  titleBox: {
    backgroundColor: '#498ceb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  listsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listBox: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  songItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  songText: {
    fontSize: 16,
    color: '#000',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#eb4c49',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#000',
    height: 45,
  },
  addButton: {
    backgroundColor: '#498ceb',
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
