import React, { useEffect, useState } from 'react';
import { IPlayerProps } from '@lottiefiles/react-lottie-player';
import dynamic from 'next/dynamic';
const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), {
  ssr: false,
});

interface LottieWrapperProps extends IPlayerProps {}

const LottieWrapper: React.FC<LottieWrapperProps> = (props) => {

  return <Player {...props} />;
};

export default LottieWrapper;