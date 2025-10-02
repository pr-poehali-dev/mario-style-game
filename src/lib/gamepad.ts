export interface GamepadState {
  left: boolean;
  right: boolean;
  jump: boolean;
  connected: boolean;
}

export const getGamepadState = (): GamepadState => {
  const gamepads = navigator.getGamepads();
  const gamepad = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

  if (!gamepad) {
    return { left: false, right: false, jump: false, connected: false };
  }

  const leftStickX = gamepad.axes[0];
  const dpadLeft = gamepad.buttons[14]?.pressed || false;
  const dpadRight = gamepad.buttons[15]?.pressed || false;
  const buttonA = gamepad.buttons[0]?.pressed || false;

  const DEADZONE = 0.2;
  const left = leftStickX < -DEADZONE || dpadLeft;
  const right = leftStickX > DEADZONE || dpadRight;

  return {
    left,
    right,
    jump: buttonA,
    connected: true
  };
};

export const isGamepadConnected = (): boolean => {
  const gamepads = navigator.getGamepads();
  return gamepads.some(gp => gp !== null);
};
