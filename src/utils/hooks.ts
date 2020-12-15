import React, { useState, useEffect, useRef } from 'react';

export interface Size {
  width: number;
  height: number;
}

export function useWindowSize() {
  const [size, setSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleResize() {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  return size;
}

export interface Scroll {
  x: number;
  y: number;
}

export function useScroll(target?: Element) {
  const [scroll, setScroll] = useState<Scroll>({
    x: target?.scrollLeft ?? window.scrollX,
    y: target?.scrollTop ?? window.scrollX,
  });

  useEffect(() => {
    (target ?? window).addEventListener('scroll', handleResize);

    return () => {
      (target ?? window).removeEventListener('scroll', handleResize);
    };
  }, []);

  function handleResize() {
    console.log(scroll);

    setScroll({
      x: target?.scrollLeft ?? window.scrollX,
      y: target?.scrollTop ?? window.scrollX,
    });
  }

  return scroll;
}

export function useTimeout(callback: Function, delay: number) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay);
      /* return () => */ clearInterval(id);
    }
  }, [delay]);
}

export function useInterval(callback: Function, delay: number) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      /* return () => */ clearInterval(id);
    }
  }, [delay]);
}

/* https://usehooks.com/useKeyPress/ */
export function useKeyPress(targetKey: any) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler(event: any) {
    if (event.keyCode === targetKey) setKeyPressed(true);
  }

  // If released key is our target key then set to false
  const upHandler = (event: any) => {
    if (event.keyCode === targetKey) setKeyPressed(false);
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}
