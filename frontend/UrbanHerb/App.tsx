/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { colors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';

// Create a theme context
export const ThemeContext = React.createContext({
  colors,
  isDark: false,
});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.background.dark : colors.background.light,
    flex: 1,
  };

  const themeValue = {
    colors,
    isDark: isDarkMode,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.container}>
          <HomeScreen />
        </View>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
