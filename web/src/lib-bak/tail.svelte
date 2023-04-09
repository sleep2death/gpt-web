<script>
  export let width = 30;
  export let height = 30;
  export let right = 0;
  export let bottom = 0;
</script>

<div
  class="absolute h-full text-inherit"
  style="width:{width}px; height:{height}px; right:{right}px; bottom:{bottom}px;"
>
  <!-- Tail SVG -->
  <svg viewBox="0 0 16 20" width="100%" height="100%"
    ><g transform="translate(8 -19)" fill="currentColor"
      ><path
        d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z"
        transform="matrix(-1 0 0 -1 0 49)"
        fill="currentColor"
      /></g
    ></svg
  >
</div>
