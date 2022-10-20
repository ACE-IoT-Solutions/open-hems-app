import React, { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Switch,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputEndEditingEventData,
  TextInputProps,
} from "react-native";
import { theme, typography } from "../../theme";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

type SettingsScreenCellProps = {
  icon: string;
  title: string;
  isSelected: boolean | undefined;
  apiPrefix?: string;
  onChange: () => void;
  accessoryView: ReactNode;
};

type SettingsScreenCellInputAccessoryViewProps = {
  cellId: string;
  cellData: string | undefined | null;
  inputLabel: string;
  placeholderLabel: string | undefined;
  keyboardType: TextInputProps["keyboardType"];
  onFieldChange: (event: NativeSyntheticEvent<TextInputChangeEventData>, key: string) => void;
  onFieldEndEditing: (event: NativeSyntheticEvent<TextInputEndEditingEventData>, key: string) => void;
};

export const SettingsScreenCell = ({
  title,
  apiPrefix,
  isSelected,
  onChange,
  icon,
  accessoryView,
}: SettingsScreenCellProps) => (
  <View>
    <TouchableOpacity onPress={onChange}>
      <View style={styles.cellContainer}>
        <View>
          <Text style={styles.cellTitle}>
            {icon}
            &nbsp;&nbsp;
            {title}
          </Text>
          {apiPrefix && <Text style={typography.label}>{apiPrefix}</Text>}
        </View>

        <View>
          <Switch
            value={isSelected}
            onChange={onChange}
            trackColor={{ true: theme.colors.orange, false: theme.backdrop }}
            thumbColor={Platform.OS != "ios" ? theme.colors.white : undefined}
          />
        </View>
      </View>
    </TouchableOpacity>
    {isSelected && accessoryView}
  </View>
);

export const SettingsScreenCellInputAccessoryView = ({
  cellId,
  cellData,
  inputLabel,
  placeholderLabel,
  keyboardType,
  onFieldChange,
  onFieldEndEditing,
}: SettingsScreenCellInputAccessoryViewProps) => {
  return (
    <View style={styles.accessoryViewContainer}>
      <Text style={styles.accessoryViewFieldLabel}>{inputLabel}</Text>
      <TextInput
        style={styles.accessoryViewInputField}
        value={cellData || ""}
        keyboardType={keyboardType}
        placeholder={placeholderLabel}
        onChange={(event) => onFieldChange(event, cellId)}
        onEndEditing={(event) => onFieldEndEditing(event, cellId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.background,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.backdrop,
  },
  cellIcon: {
    marginBottom: 12,
  },
  cellTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.regular,
    color: theme.text,
  },
  accessoryViewContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  accessoryViewFieldLabel: {
    fontSize: 18,
    color: theme.text,
    fontFamily: theme.fonts.regular,
  },
  accessoryViewInputField: {
    flex: 1,
    marginLeft: 22,
    padding: 12,
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    color: theme.text,
    fontFamily: theme.fonts.regular,
  },
});
