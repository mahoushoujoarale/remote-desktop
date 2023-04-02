export interface IApi {
  handleMouse: (data) => void;
  handleKeyboard: (data) => void;
  getMediaStream: () => Promise<MediaStream | null>;
}
