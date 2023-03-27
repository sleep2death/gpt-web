<script>
  import { writable } from "svelte/store";
  import ActionBtnLeft from "./action-btn-left.svelte";
  import ActionBtnRight from "./action-btn-right.svelte";
  import Textarea from "./textarea.svelte";

  import { error, speak, input } from "./store";

  const mode = writable("normal");

  const options = { mimeType: "audio/webm" };
  let recordedChunks = [];
  let mediaRecorder = null;

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
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      mediaRecorder = new MediaRecorder(ms, options);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = onRecorderDataAvailable;
      mediaRecorder.onstop = onRecorderStop;
    } catch (e) {
      $error = "can't access user's microphone: " + e;
    }
  }

  function onRecorderDataAvailable(evt) {
    if (evt.data.size > 0) recordedChunks.push(evt.data);
  }

  async function onRecorderStop() {
    // console.log(recordedChunks.length);
    const blob = new Blob(recordedChunks, { type: "audio/webm; codecs=opus" });

    try {
      await speak(blob);
      recordedChunks = [];
    } catch (e) {
      $error = "sound file build failed: " + e;
    }
  }

  function onLongPressedUp() {
    $mode = "normal";
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }
</script>

<div
  class="absolute flex flex-row z-20 justify-center md:pb-8 md:px-16 bottom-0 w-full"
>
  <div
    class="flex flex-row justify-center w-full  md:max-w-4xl pb-8 px-2 pt-2 md:p-4 bg-stone-200 border-t dark:bg-stone-700 dark:border-stone-600 md:rounded-2xl space-x-1"
  >
    <div class="py-1 flex flex-col justify-end">
      <ActionBtnLeft />
    </div>
    <div class="flex flex-col justify-center w-full">
      <Textarea />
    </div>
    <div class="py-1 flex flex-col justify-end">
      <ActionBtnRight
        mode={$mode}
        on:longpressed={onLongPressed}
        on:longpressup={onLongPressedUp}
      />
    </div>
  </div>
</div>
