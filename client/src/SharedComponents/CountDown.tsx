import React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';

interface CountDownProps {
  created: string;
  renderer: CountdownRendererFn;
}


const CountDown: React.FC<CountDownProps> = props => {

  const { created, renderer } = props;
  const expiration = Date.parse(created) + (14 * 24 * 60 * 60 * 1000);

  return (
    <div>
      <Countdown
        date={expiration}
        renderer={renderer}
      />
    </div>
  );
};

export default CountDown;