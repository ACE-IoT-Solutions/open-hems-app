import React from "react";
import { useWindowDimensions, View } from "react-native";
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from "react-native-responsive-linechart";
import { sanitize, upperBounds } from "../../utils/visualization";
import { theme, typography } from "../../theme";

type DataPoint = { x: number; y: number };
type PowerGraphProps = {
  data: Array<DataPoint>;
};

export function PowerUsageGraph({ data: rawData }: PowerGraphProps) {
  const data = sanitize(rawData);
  const dimensions = useWindowDimensions();
  const chartWidth = dimensions.width;

  return (
    <View
      testID="PowerUsageGraph"
      style={{
        backgroundColor: theme.colors.white,
        paddingVertical: theme.padding,
      }}
    >
      <Chart
        style={{
          height: 260,
          width: chartWidth,
        }}
        data={data}
        disableGestures
        padding={{ left: 20, bottom: 40, right: 65, top: 40 }}
        xDomain={{ min: 0, max: 23 }}
        yDomain={{ min: 0, max: upperBounds(data.map(({ y }) => y)) }}
      >
        <VerticalAxis
          tickCount={2}
          theme={{
            axis: {
              stroke: {
                color: theme.primary,
                width: 1,
                opacity: 0.15,
                dashArray: [],
              },
              dx: chartWidth - 85,
            },

            grid: { visible: false },
            ticks: { visible: false },

            labels: {
              visible: true,
              label: {
                ...typography.label,
                dx: chartWidth - 75,
                dy: 0,
                textAnchor: "start",
              },
              formatter: (v: number) => `${v.toFixed(3)} kWh`,
            },
          }}
        />

        <HorizontalAxis
          tickValues={[0, 6, 12, 18]}
          theme={{
            axis: {
              visible: true,
              stroke: {
                color: theme.primary,
                width: 1,
                opacity: 0.15,
                dashArray: [],
              },
            },

            grid: {
              visible: true,
              stroke: {
                color: theme.primary,
                width: 1,
                opacity: 0.15,
                dashArray: [5],
              },
            },

            ticks: { visible: false },

            labels: {
              label: {
                ...typography.label,
                dy: -20,
                textAnchor: "start",
              },
              formatter: (v: number) => {
                const hour = v % 12 == 0 ? "12" : String(v % 12);
                const meridiem = v < 12 ? "AM" : "PM";

                return `${hour}${meridiem}`;
              },
            },
          }}
        />
        <Area
          theme={{
            gradient: {
              from: {
                color: theme.colors.periwinkle,
              },
              to: {
                color: theme.colors.periwinkle,
                opacity: 0.4,
              },
            },
          }}
        />
        <Line
          theme={{
            stroke: {
              color: theme.primary,
              width: 2,
            },

            scatter: {
              default: {
                width: 4,
                height: 4,
                rx: 2,
              },
            },
          }}
        />
      </Chart>
    </View>
  );
}
