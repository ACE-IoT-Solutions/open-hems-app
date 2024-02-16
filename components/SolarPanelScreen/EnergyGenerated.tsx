import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "../../theme";
import { WattHours } from "../../types";
import { formatEnergy, formatPercentage } from "../../utils/formatters";

type EnergyGeneratedProps = {
  energyGenerated: WattHours;
  energySentToGrid: WattHours;
};

export function EnergyGenerated({ energyGenerated, energySentToGrid }: EnergyGeneratedProps) {
  const formattedEnergyGenerated = formatEnergy(energyGenerated);
  const formattedEnergySentToGrid = formatEnergy(energySentToGrid);
  const formattedPercentageEnergySentToGrid = formatPercentage(energySentToGrid, energyGenerated);
  return (
    <View testID="EnergyGenerated" style={styles.monthlySummary}>
      <View style={styles.alignLeft}>
        <Text style={typography.headline2} allowFontScaling={false}>
          {formattedEnergyGenerated}
        </Text>
        <Text style={typography.label} maxFontSizeMultiplier={1.5}>
          This Month
        </Text>
      </View>

      <View style={styles.alignRight}>
        <View>
          <Text style={typography.headline2} allowFontScaling={false}>
            {formattedEnergySentToGrid} ({formattedPercentageEnergySentToGrid})
          </Text>
        </View>
        <Text style={typography.label} maxFontSizeMultiplier={1.5}>
          Sent to Grid
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: theme.padding,
    paddingHorizontal: theme.padding,
  },

  monthlySummary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  alignLeft: {
    alignItems: "flex-start",
  },

  alignRight: {
    alignItems: "flex-end",
  },
});
