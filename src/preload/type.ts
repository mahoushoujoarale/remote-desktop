export interface IApi {
  handleConnect: () => void;
  handleDisconnect: () => void;
  handleMouse: (data) => void;
  handleKeyboard: (data) => void;
}
