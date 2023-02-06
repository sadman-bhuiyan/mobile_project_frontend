import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Ingredients from './screens/Ingredients';


export default function App() {
  const colorScheme = useColorScheme();

    return (
      <ApplicationProvider {...eva} theme={eva.light}>
                <Navigation/>
        <StatusBar />
      </ApplicationProvider>
    );
  }

