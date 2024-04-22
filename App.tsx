import * as React from 'react';
import {
  Button,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  createDrawerNavigator,
  useDrawerProgress,
  useDrawerStatus,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolate,
} from 'react-native-reanimated';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';

const AnimatedMenuDrawer = (props: any) => {
  const isDrawerVisible = useDrawerStatus() === 'open';
  const animatedDrawer = useDrawerProgress();
  const {width, height} = useWindowDimensions();
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animatedDrawer.value,
            [0, 1],
            [0, width * 0.55],
            Extrapolate.CLAMP,
          ),
        },
        {
          scale: interpolate(
            animatedDrawer.value,
            [0, 1],
            [1, 0.8],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#8551EF'}}>
      <StatusBar backgroundColor={'#8551EFBF'} />
      <Animated.View
        style={{
          borderRadius: 20,
          position: 'absolute',
          // zIndex:-10,
          height: heightPercentageToDP(100),
          width: widthPercentageToDP(100),
          backgroundColor: 'white',
          opacity: 0.4,
          transform: [
            {
              translateX: widthPercentageToDP(45),
            },
            {
              scale: 0.72,
            },
          ],
        }}></Animated.View>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: 'white',
            borderRadius: isDrawerVisible ? 20 : 0,
          },
          style,
        ]}>
        {props.children}
      </Animated.View>
    </View>
  );
};

const Header = props => {
  const isDrawerVisible = useDrawerStatus() === 'open';
  return (
    <View
      style={{
        backgroundColor: '#8551EF',
        // alignItems: 'center',
        height: 64,
        justifyContent: 'center',
        paddingLeft: 20,
        elevation: 5,
        borderTopLeftRadius: isDrawerVisible ? 20 : 0,
      }}>
      <Pressable onPress={() => props.navigation.toggleDrawer()}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/5259/5259008.png',
          }}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </Pressable>
    </View>
  );
};
function HomeScreen({navigation}) {
  const isDrawerVisible = useDrawerStatus() === 'open';
  const abortController = new AbortController();
  const [user, setUser] = React.useState(null);
  const callApi = () => {
    fetch('https://reqres.in/api/users', {
      signal: abortController.signal,
    })
      .then(res => res.json())
      .then(res => setUser(res))
      .catch(err => console.log(err));
  };

  const abortApi = () => {
    abortController.abort();
  };

  return (
    <AnimatedMenuDrawer>
      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 10,
          height: heightPercentageToDP(30),
        }}
        scrollEnabled={!isDrawerVisible}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}>
        {Array.from({
          length: 10,
        }).map((_, index) => {
          return (
            <View
              key={index}
              style={{
                height: heightPercentageToDP(20),
                width: widthPercentageToDP(100),
                paddingHorizontal: widthPercentageToDP(3),
              }}>
              <View
                style={{
                  height: '100%',
                  width: 'auto',
                  borderRadius: 20,
                  backgroundColor: `black`,
                }}></View>
            </View>
          );
        })}
      </ScrollView>
      <Text
        style={{
          fontSize: 10,
          alignSelf: 'center',
        }}>
        {JSON.stringify(user)}
      </Text>
      <Button onPress={abortApi} title="abort Api" />
      <Button onPress={callApi} title="callApi" />
      <Button onPress={() => setUser(null)} title="clearScreen" />
    </AnimatedMenuDrawer>
  );
}

function Other(props) {
  return (
    <AnimatedMenuDrawer>
      <Header navigation={props.navigation} />
      <View style={{flex: 1}}>
        <Text>other</Text>
      </View>
    </AnimatedMenuDrawer>
  );
}
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <Drawer.Navigator
            screenOptions={{
              drawerStatusBarAnimation: 'slide',
              drawerActiveBackgroundColor: 'white',
              drawerStyle: {
                backgroundColor: '#8551EF', //8551EF
                width: widthPercentageToDP(55),
              },
              headerShown: false,
              overlayColor: 'transparent',
            }}
            initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Other" component={Other} />
          </Drawer.Navigator>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
