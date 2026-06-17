import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Incoming</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon selectedColor={"#f76b2e"}     
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
          
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="outgoing">
        <NativeTabs.Trigger.Label>Outgoing</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon selectedColor={"#f76b2e"} 
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="clients">
        <NativeTabs.Trigger.Label>Clients</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon selectedColor={"#f76b2e"} 
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
