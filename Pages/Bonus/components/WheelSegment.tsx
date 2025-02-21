import React from "react";
import { G, Path, Rect, Text as SText } from "react-native-svg";
import Animated, {
  createAnimatedPropAdapter,
  interpolateColor,
  processColor,
  useAnimatedProps,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type SegmentData = {
  pathData: string;
  centroid: [number, number];
  rotationAngle: number;
  amount: number;
};

type WheelSegmentProps = {
  segment: SegmentData;
  selectedSegmentAnimatedIndex: Animated.SharedValue<number>;
  colorProgress: Animated.SharedValue<number>;
  index: number;
};

const WheelSegment: React.FC<WheelSegmentProps> = ({
  segment,
  selectedSegmentAnimatedIndex,
  colorProgress,
  index,
}) => {
  const adapter = createAnimatedPropAdapter(
    (props: any) => {
      if (Object.keys(props).includes("fill")) {
        props.fill = { type: 0, payload: processColor(props.fill) };
      }
    },
    ["fill"]
  );

  const segmentProps = useAnimatedProps(
    () => {
      const baseColor = index % 3 === 0 ? "#F9FCF0" : // White segments
                       index % 3 === 1 ? "#252830" :  // Black segments
                       "#FFD700";                     // Gold segments

      return {
        fill:
          index === selectedSegmentAnimatedIndex.value
            ? interpolateColor(colorProgress.value, [0, 1], [baseColor, baseColor])
            : interpolateColor(colorProgress.value, [0, 1], [baseColor, baseColor]),
      };
    },
    [],
    adapter
  );

  // Get text color based on segment color
  const textColor = index % 3 === 1 ? "#FFFFFF" : "#000000"; // White text only on black segments

  return (
    <G>
      <AnimatedPath
        d={segment.pathData}
        animatedProps={segmentProps}
        stroke={"#FFD700"}
        strokeWidth={3}
      />

      <G x={segment.centroid[0]} y={segment.centroid[1]} transform={`rotate(${segment.rotationAngle})`}>
        {/* Number value */}
        <SText
          fontSize={24}
          x={0}
          y={-8}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="central"
          fill={textColor}
        >
          {segment.amount}
        </SText>
        {/* "Points" text */}
        <SText
          fontSize={22}
          x={0}
          y={20}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="central"
          fill={textColor}
        >
          {segment.amount === 1 ? 'Point' : 'Points'}
        </SText>
      </G>
    </G>
  );
};

export default WheelSegment;