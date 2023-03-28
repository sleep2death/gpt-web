<script>
  import { writable } from "svelte/store";
  import ActionBtnLeft from "./action-btn-left.svelte";
  import ActionBtnRight from "./action-btn-right.svelte";
  import Textarea from "./textarea.svelte";

  import { error, whisper, input, send } from "./store";

  const mode = writable("normal");

  let options = { mimeType: "audio/webm" };

  let recordedChunks = [];
  let mediaRecorder = null;
  let stream = null;

  input.subscribe((i) => {
    if (i !== "") {
      $mode = "input";
    } else {
      $mode = "normal";
    }
  });

  async function onLongPressed() {
    $mode = "recording";
    try {
      if (MediaRecorder.isTypeSupported('audio/webm; codecs=vp9')) {
        options = {mimeType: 'audio/webm; codecs=vp9'};
      } else  if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = {mimetype: 'audio/webm'};
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = {mimetype: 'audio/mp4', videobitspersecond : 50000};
      } else {
        throw new Error("mimetype not supported")
      }

      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = onRecorderDataAvailable;
      mediaRecorder.onstop = onRecorderStop;
    } catch (e) {
      $error = "can't access user's microphone: " + e;
      stop()
    }
  }

  function onRecorderDataAvailable(evt) {
    if (evt.data.size > 0) recordedChunks.push(evt.data);
  }

  async function onRecorderStop() {
    // console.log(recordedChunks.length);

    const blob = new Blob(recordedChunks, { type: options.mimetype });

    try {
      console.log("sending speak");
      if (recordedChunks.length > 0) {
        await whisper(blob);
        recordedChunks = [];
      }
    } catch (e) {
      console.error(e);
      $error = "sound file build failed: " + e;
    } finally {
      stop()
    }
  }

  function stop() {
    if (stream) {
      stream
        .getTracks() // get all tracks from the MediaStream
        .forEach((track) => track.stop()); // stop each of them
    }
    if ($input !== "") {
      $mode = "input";
    } else {
      $mode = "normal";
    }
  }

  function onTouchEnd() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }
</script>

<div
  class="absolute flex flex-row z-20 justify-center md:pb-8 md:px-16 bottom-0 w-full"
>
  <div
    class="flex flex-row justify-center w-full md:max-w-4xl pb-8 px-2 pt-2 md:p-4 bg-stone-200 border-t dark:bg-stone-700 dark:border-stone-600 md:rounded-2xl space-x-1"
  >
    <div class="py-1 flex flex-col justify-end">
      <ActionBtnLeft />
    </div>
    <div class="flex flex-col justify-center w-full">
      <Textarea />
    </div>
    <div class="mx-4 py-1 flex flex-col justify-end">
      <ActionBtnRight
        mode={$mode}
        on:longpressed={onLongPressed}
        on:longpressup={onTouchEnd}
        on:click={send}
      />
    </div>
  </div>
</div>
