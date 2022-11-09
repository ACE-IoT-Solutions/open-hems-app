import React, { ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputEndEditingEventData,
} from "react-native";

import {
  SettingsScreenCell,
  SettingsScreenCellInputAccessoryView,
} from "../components/SettingsScreen/SettingsScreenCell";
import { ApiPrefixName, defaultEndpoint, githubPagesEndpoint } from "../utils/api";
import { USER_API_PREFIX_KEY } from "../constants/api.constants";

type SettingsScreenMenuItem = {
  id: ApiPrefixName;
  apiPrefix?: string;
  icon: string;
  title: string;
  accessoryView: ((id: string) => ReactNode) | null | undefined;
};

export const SettingsScreen = () => {
  const [selectedPrefix, setSelectedPrefix] = useState<string | null>();
  const [selectedPrefixData, setSelectedPrefixData] = useState<string | null>();

  const menuItems: SettingsScreenMenuItem[] = [
    {
      id: "digitalOcean",
      apiPrefix: defaultEndpoint,
      icon: "🌊",
      title: "Digital Ocean",
      accessoryView: null,
    },
    {
      id: "githubPages",
      apiPrefix: githubPagesEndpoint,
      icon: "🐙",
      title: "GitHub Pages",
      accessoryView: null,
    },
    {
      id: "localhost",
      icon: "🔌",
      title: "localhost",
      accessoryView: (id: string) => (
        <SettingsScreenCellInputAccessoryView
          cellId={id}
          cellData={selectedPrefixData}
          inputLabel="Port"
          placeholderLabel="5000"
          keyboardType="numeric"
          onFieldChange={handleFieldChange}
          onFieldEndEditing={handleFieldEndEditing}
        />
      ),
    },
    {
      id: "customUrl",
      icon: "🌎",
      title: "Custom",
      accessoryView: (id: string) => (
        <SettingsScreenCellInputAccessoryView
          cellId={id}
          cellData={selectedPrefixData}
          inputLabel="URL"
          placeholderLabel="https://www.aceiotsolutions.com/api/v1/"
          keyboardType="url"
          onFieldChange={handleFieldChange}
          onFieldEndEditing={handleFieldEndEditing}
        />
      ),
    },
  ];

  const isSelectedPrefix = (title: string) => {
    return title === selectedPrefix;
  };

  async function handleFieldChange(event: NativeSyntheticEvent<TextInputChangeEventData>, key: string) {
    const value = event.nativeEvent.text;

    await AsyncStorage.setItem(key, value);
    setSelectedPrefixData(value);
  }

  async function handleFieldEndEditing(event: NativeSyntheticEvent<TextInputEndEditingEventData>, key: string) {
    const value = event.nativeEvent.text;

    await AsyncStorage.setItem(key, value);
    setSelectedPrefixData(value);
  }

  async function handleSwitchToggle(prefix: string) {
    if (prefix === selectedPrefix) {
      // If we're toggling a switch that's already "on", turn it "off" and leave none selected
      return await handleReset();
    }

    await AsyncStorage.setItem(USER_API_PREFIX_KEY, prefix);
    setSelectedPrefix(prefix);
  }

  async function handleReset() {
    await AsyncStorage.removeItem(USER_API_PREFIX_KEY);

    setSelectedPrefix(null);
    setSelectedPrefixData(null);
  }

  useEffect(() => {
    async function getSelectedPrefix() {
      const selectedPrefix = await AsyncStorage.getItem(USER_API_PREFIX_KEY);

      if (selectedPrefix) {
        const data = await AsyncStorage.getItem(selectedPrefix);

        setSelectedPrefix(selectedPrefix);
        setSelectedPrefixData(data);
      }
    }

    getSelectedPrefix();
  }, [selectedPrefix, selectedPrefixData]);

  const renderSettingsScreenCell = ({ item }: ListRenderItemInfo<SettingsScreenMenuItem>) => {
    const menuItemData = menuItems.find((menuItem) => menuItem === item);
    const accessoryView = menuItemData?.accessoryView && menuItemData?.accessoryView(item.id);

    return (
      <SettingsScreenCell
        icon={item.icon}
        title={item.title}
        apiPrefix={item.apiPrefix}
        isSelected={isSelectedPrefix(item.id)}
        onChange={() => handleSwitchToggle(item.id)}
        accessoryView={accessoryView}
      />
    );
  };

  return <FlatList data={menuItems} renderItem={renderSettingsScreenCell} keyExtractor={(item) => item.title} />;
};
