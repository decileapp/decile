import colors from "../../../utils/theme/colors";

export const graphTheme = (theme: string) => {
  // Colors
  const fontColor = theme === "dark" ? colors.zinc[100] : colors.zinc[900];
  const axisColor = theme === "dark" ? colors.zinc[500] : "#f4f4f5";
  const background = theme === "dark" ? colors.zinc[700] : colors.white;
  const gridColor = theme === "dark" ? colors.zinc[500] : "#f4f4f5";

  return {
    background: background,
    fontFamily: "Inter",
    textColor: fontColor,
    fontSize: 14,
    labels: {
      text: {
        stroke: "#FFFFFF",
        fontSize: 12,
      },
    },
    axis: {
      domain: {
        line: {
          stroke: axisColor,
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: fontColor,
          fontWeight: "bold",
        },
      },
      ticks: {
        line: {
          stroke: axisColor,
          strokeWidth: 1,
        },
        text: {
          fontSize: 12,
          fill: fontColor,
        },
      },
    },
    grid: {
      line: {
        stroke: gridColor,
        strokeWidth: 1,
      },
    },
    legends: {
      title: {
        text: {
          fontSize: 12,
          fill: fontColor,
        },
      },

      text: {
        fontSize: 12,
        fill: fontColor,
      },
      ticks: {
        line: {},
        text: {
          fill: fontColor,
        },
      },
    },
    annotations: {
      text: {
        // fontSize: 13,
        fill: fontColor,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      link: {
        stroke: "#000000",
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      outline: {
        stroke: "#000000",
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      symbol: {
        fill: "#000000",
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
    },
    tooltip: {
      container: {
        background: background,
        fontSize: 12,
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {},
    },
  };
};

export const marginProps = (x?: boolean) => {
  return { top: 50, right: x ? 150 : 100, bottom: 120, left: 100 };
};
