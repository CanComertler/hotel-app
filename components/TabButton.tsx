// components/TabButton.tsx
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import React, { useState } from 'react';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export type TabButtonType = {
  title: string;
};

type TabButtonsProps = {
  buttons: TabButtonType[];
  selectedTab: number;
  setSelectedTab: (index: number) => void;
};

export default function TabButton({ buttons, selectedTab, setSelectedTab }: TabButtonsProps) {
  const [dimensions, setDimensions] = useState({ width: 100, height: 20 });

  const buttonWidth = dimensions.width / buttons.length;
  const tabPositionX = useSharedValue(0);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const handlePress = (index: number) => {
    setSelectedTab(index);
  };

  const onTabPress = (index: number) => {
    tabPositionX.value = withTiming(buttonWidth * index, {}, () => {
      runOnJS(handlePress)(index);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  return (
    <View
      style={{
        backgroundColor: '#e32f45',
        borderRadius: 20,
        margin: 20,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            backgroundColor: '#fff',
            borderRadius: 15,
            marginHorizontal: 5,
            height: dimensions.height - 10,
            width: buttonWidth - 10,
          },
        ]}
      />
      <View onLayout={onTabbarLayout} style={{ flexDirection: 'row' }}>
        {buttons.map((button, index) => {
          const isSelected = selectedTab === index;
          return (
            <Pressable
              key={index}
              style={{ flex: 1, paddingVertical: 20 }}
              onPress={() => onTabPress(index)}
            >
              <Text
                style={{
                  color: isSelected ? '#e32f45' : '#fff',
                  alignSelf: 'center',
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                {button.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
