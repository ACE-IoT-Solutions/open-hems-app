import React from "react";
import { StyleSheet, View, Text, Modal } from "react-native";
import { Button } from "../components/Button";
import { theme, typography } from "../theme";

type OptOutModalProps = {
  visible: boolean;
  message: string;
  onPressConfirm: () => void;
  onPressGoBack: () => void;
};
export function OptOutModal({ message, visible, onPressGoBack, onPressConfirm }: OptOutModalProps) {
  return (
    <Modal testID="OptOutModal" animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.optOutModal}>
          <Text style={styles.optOutTitle} maxFontSizeMultiplier={2}>
            Are you sure?
          </Text>
          <Text style={styles.optOutMessage} maxFontSizeMultiplier={2}>
            {message}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Button label="Go Back" onPress={onPressGoBack} style={styles.optOutButton} />
            <Button
              label="Confirm"
              onPress={onPressConfirm}
              style={{ ...styles.optOutButton, marginLeft: theme.padding, backgroundColor: theme.colors.red }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.backgroundMask,
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.padding,
    paddingVertical: 2 * theme.padding,
  },
  optOutModal: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
    padding: theme.padding,
    maxWidth: 300,
    borderRadius: 4,
  },
  optOutTitle: {
    ...typography.headline3Bold,
    marginTop: theme.padding * 2,
  },
  optOutMessage: {
    ...typography.headline3,
    padding: theme.padding,
    marginBottom: theme.padding * 2,
    textAlign: "center",
    letterSpacing: 0.4,
    lineHeight: 26,
  },
  optOutButton: {
    marginTop: theme.padding,
    paddingVertical: theme.padding,
    paddingHorizontal: theme.padding * 2,
  },
});
