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
      return {
        fill:
          index === selectedSegmentAnimatedIndex.value
            ? interpolateColor(colorProgress.value, [0, 1], ["black", "black"])
            : interpolateColor(colorProgress.value, [0, 1], ["black", "#1f1d1d"]),
      };
    },
    [],
    adapter
  );

  return (
    <G>
      <AnimatedPath d={segment.pathData} animatedProps={segmentProps} stroke={"black"} />
      <G x={segment.centroid[0]} y={segment.centroid[1]} transform={`rotate(${segment.rotationAngle})`}>
        <SText
          fontSize={22}
          x={0}
          y={5}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="central"
          fill="white"
        >
          {segment.amount}
        </SText>
      </G>
    </G>
  );
};

export default WheelSegment;
