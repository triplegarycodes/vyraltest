import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import NeoMascot from '../components/NeoMascot';

const NeoMascotContext = createContext({
  triggerReaction: () => {},
});

export const NeoMascotProvider = ({ children }) => {
  const [reaction, setReaction] = useState(null);
  const energy = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(orbit, {
          toValue: 1,
          duration: 7000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(orbit, {
          toValue: 0,
          duration: 7000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [orbit]);

  const triggerReaction = useCallback(
    (type = 'pulse') => {
      setReaction(type);
      energy.setValue(0);

      Animated.sequence([
        Animated.timing(energy, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(energy, {
          toValue: 0,
          duration: 620,
          delay: 120,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setReaction(null);
      });
    },
    [energy],
  );

  const value = useMemo(() => ({ triggerReaction }), [triggerReaction]);

  return (
    <NeoMascotContext.Provider value={value}>
      {children}
      <NeoMascot energy={energy} orbit={orbit} reaction={reaction} />
    </NeoMascotContext.Provider>
  );
};

export const useNeoMascot = () => useContext(NeoMascotContext);

export default NeoMascotContext;
