import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Polyline,
  Rect,
  Stop,
} from 'react-native-svg';

const createNeonTile = (name, renderContent) => {
  const gradientId = `${name}TileGradient`;
  const accentId = `${name}TileAccent`;

  const ModuleArt = ({ width = 64, height = 64, style, ...props }) => (
    <Svg width={width} height={height} viewBox="0 0 64 64" style={style} {...props}>
      <Defs>
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#080B18" />
          <Stop offset="100%" stopColor="#04060F" />
        </LinearGradient>
        <LinearGradient id={accentId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#7DFBFF" />
          <Stop offset="100%" stopColor="#5C6CFF" />
        </LinearGradient>
      </Defs>
      <Rect
        x={4}
        y={4}
        width={56}
        height={56}
        rx={16}
        fill={`url(#${gradientId})`}
        stroke="rgba(109, 247, 255, 0.4)"
        strokeWidth={1.2}
      />
      <Rect x={7} y={7} width={50} height={50} rx={14} fill="rgba(109, 247, 255, 0.08)" />
      {renderContent({ accentId })}
    </Svg>
  );

  ModuleArt.displayName = `${name.charAt(0).toUpperCase() + name.slice(1)}ModuleArt`;

  return ModuleArt;
};

const StrykeArt = createNeonTile('stryke', ({ accentId }) => (
  <>
    <Path
      d="M32 14 L48 46 H16 Z"
      fill="none"
      stroke={`url(#${accentId})`}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M32 24 L40 40 H24 Z"
      fill="none"
      stroke="rgba(125, 251, 255, 0.55)"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
));

const CoreArt = createNeonTile('core', ({ accentId }) => (
  <>
    <Polyline
      points="18,40 28,30 34,34 46,22"
      fill="none"
      stroke={`url(#${accentId})`}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={46} cy={22} r={4} fill="rgba(109, 247, 255, 0.25)" />
    <Circle cx={46} cy={22} r={2.6} fill={`url(#${accentId})`} />
    <Line x1={22} y1={44} x2={46} y2={44} stroke="rgba(109, 247, 255, 0.25)" strokeWidth={1.2} />
  </>
));

const ZoneArt = createNeonTile('zone', ({ accentId }) => (
  <>
    <Circle
      cx={32}
      cy={32}
      r={14}
      stroke={`url(#${accentId})`}
      strokeWidth={2.8}
      fill="none"
    />
    <Circle cx={32} cy={32} r={8} stroke="rgba(125, 251, 255, 0.5)" strokeWidth={2.2} fill="none" />
    <Circle cx={32} cy={32} r={3} fill={`url(#${accentId})`} />
    <Line x1={32} y1={18} x2={32} y2={22} stroke="rgba(125, 251, 255, 0.6)" strokeWidth={2} strokeLinecap="round" />
    <Line x1={46} y1={32} x2={42} y2={32} stroke="rgba(125, 251, 255, 0.45)" strokeWidth={2} strokeLinecap="round" />
    <Line x1={32} y1={46} x2={32} y2={42} stroke="rgba(125, 251, 255, 0.45)" strokeWidth={2} strokeLinecap="round" />
    <Line x1={18} y1={32} x2={22} y2={32} stroke="rgba(125, 251, 255, 0.45)" strokeWidth={2} strokeLinecap="round" />
  </>
));

const SkrybeArt = createNeonTile('skrybe', ({ accentId }) => (
  <>
    <Path
      d="M28 14 L18 34 H30 L24 50 L46 26 H34 Z"
      fill="none"
      stroke={`url(#${accentId})`}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M27 36 L32 32"
      stroke="rgba(125, 251, 255, 0.55)"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </>
));

const LyfeArt = createNeonTile('lyfe', ({ accentId }) => (
  <>
    <Path
      d="M20 40 C20 26 44 26 44 40"
      fill="none"
      stroke={`url(#${accentId})`}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Path
      d="M24 36 C24 30 40 30 40 36"
      fill="none"
      stroke="rgba(125, 251, 255, 0.5)"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Circle cx={32} cy={24} r={6} stroke={`url(#${accentId})`} strokeWidth={2.6} fill="none" />
    <Circle cx={32} cy={24} r={2.4} fill={`url(#${accentId})`} />
  </>
));

const TreeArt = createNeonTile('tree', ({ accentId }) => (
  <>
    <Path
      d="M32 16 L32 46"
      stroke={`url(#${accentId})`}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Polyline
      points="32,20 24,26 28,26 22,32 28,32 24,38"
      fill="none"
      stroke="rgba(125, 251, 255, 0.55)"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="32,20 40,26 36,26 42,32 36,32 40,38"
      fill="none"
      stroke="rgba(125, 251, 255, 0.55)"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x={28} y={46} width={8} height={6} rx={2} fill={`url(#${accentId})`} />
  </>
));

const BoardArt = createNeonTile('board', ({ accentId }) => (
  <>
    <Rect x={18} y={20} width={28} height={8} rx={3} stroke={`url(#${accentId})`} strokeWidth={2.4} fill="none" />
    <Rect x={18} y={32} width={12} height={12} rx={3} stroke={`url(#${accentId})`} strokeWidth={2.2} fill="none" />
    <Rect x={34} y={32} width={12} height={12} rx={3} stroke="rgba(125, 251, 255, 0.55)" strokeWidth={2} fill="none" />
    <Line x1={18} y1={28} x2={46} y2={28} stroke="rgba(125, 251, 255, 0.3)" strokeWidth={1.4} />
  </>
));

const VshopArt = createNeonTile('vshop', ({ accentId }) => (
  <>
    <Path
      d="M22 26 L42 26 L40 46 H24 Z"
      fill="none"
      stroke={`url(#${accentId})`}
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
    <Path
      d="M24 26 C24 22 28 18 32 18 C36 18 40 22 40 26"
      fill="none"
      stroke="rgba(125, 251, 255, 0.55)"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <Circle cx={28} cy={34} r={1.8} fill={`url(#${accentId})`} />
    <Circle cx={36} cy={34} r={1.8} fill={`url(#${accentId})`} />
  </>
));

const moduleAssets = {
  stryke: StrykeArt,
  core: CoreArt,
  zone: ZoneArt,
  skrybe: SkrybeArt,
  lyfe: LyfeArt,
  tree: TreeArt,
  board: BoardArt,
  vshop: VshopArt,
};

export const getModuleAsset = (value) => {
  if (!value) {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return moduleAssets[normalized] ?? null;
};

export default moduleAssets;
