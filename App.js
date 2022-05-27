import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { OnBoarding, SignUp, SignIn, Otp, ForgotPassword } from './screens';
import {
  ProjectsDetails,
  ProjectTeam,
  Contractors,
  StocksAndInventry,
  ProjectReports,
  ToolsAndMachinery,
  ProjectSeheduleTime,
} from './screens/admin_screens';
import {UserDashboard} from './screens/user_screens';
import Tabs from './navigation/tabs';
import { Account } from './screens/admin_screens';


const Stack = createStackNavigator();

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'Home'}>
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="ProjectsDetails" component={ProjectsDetails} />
        <Stack.Screen name="ProjectTeam" component={ProjectTeam} />
        <Stack.Screen name="Contractors" component={Contractors} />
        <Stack.Screen name="StocksAndInventry" component={StocksAndInventry} />
        <Stack.Screen name="ProjectReports" component={ProjectReports} />
        <Stack.Screen name="ToolsAndMachinery" component={ToolsAndMachinery} />

        {/* User  */}
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen
          name="ProjectSeheduleTime"
          component={ProjectSeheduleTime}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
