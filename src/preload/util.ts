import { DesktopCapturerSource } from "electron";

export async function getStreamById(id: DesktopCapturerSource) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        // @ts-ignore electron不支持
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: id,
        },
      },
    });
    return stream;
  } catch (e) {
    console.log(e);
    return null;
  }
}
