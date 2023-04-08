<script>
  import { derived, writable } from "svelte/store";
  import { chat } from "../../store/chat.js";
  import { addMessages } from "../../store/session.js";
  import ActionButton from "./action-button.svelte";
  import { state } from "../../store/store";

  const value = writable("");
  const isValueEmpty = derived(value, ($value) => $value === "");
  const isLoading = derived(state, ($state) => $state === "loading");

  value.subscribe((v) => {
    $value = html2text(v.trim());
  });

  function html2text(html) {
    let res = html.replace(/<style([\s\S]*?)<\/style>/gi, "");
    res = res.replace(/<script([\s\S]*?)<\/script>/gi, "");
    res = res.replace(/<\/div>/gi, "\n");
    res = res.replace(/<\/li>/gi, "\n");
    res = res.replace(/<li>/gi, "  *  ");
    res = res.replace(/<\/ul>/gi, "\n");
    res = res.replace(/<\/p>/gi, "\n");
    res = res.replace(/<br\s*[\/]?>/gi, "\n");
    res = res.replace(/<[^>]+>/gi, "");
    return res;
  }

  async function onKeyDown(evt) {
    if (evt.key === "Enter" && !evt.altKey && !evt.shiftKey) {
      await send();
    }
  }

  async function onClick() {
    if ($isValueEmpty) {
    } else {
      await send();
    }
  }

  async function send() {
    if ($value === "") return;
    addMessages([
      { role: "user", content: $value },
      { role: "assistant", content: "" },
    ]);
    $value = "";
    await chat();
  }
</script>

<div class="w-full bg-lime-100 flex flex-row justify-center">
  <div class="w-full pt-1 pb-6 bg-lime-100" style="max-width:728px">
    <div class="w-full flex flex-row items-end">
      <!-- input box -->
      <div
        class="chat-bubble-right rounded-2xl bg-white py-4 px-4 flex-grow mx-1 relative drop-shadow-md"
      >
        <div
          contenteditable
          class="w-full outline-none break-all"
          bind:innerHTML={$value}
          on:keydown={onKeyDown}
        />
        <div class="text-white" />
      </div>
      <div class="mx-1 drop-shadow-md">
        <ActionButton useMic={isValueEmpty} {isLoading} on:click={onClick} />
      </div>
    </div>
  </div>
</div>
