<script>
  // COPIED from https://svelte.dev/repl/d65a4e9f0ae74d1eb1b08d13e428af32?version=3.35.0
  // based on suggestions from:
  // Inclusive Components by Heydon Pickering https://inclusive-components.design/toggle-button/
  // On Designing and Building Toggle Switches by Sara Soueidan https://www.sarasoueidan.com/blog/toggle-switch-design/
  // and this example by Scott O'hara https://codepen.io/scottohara/pen/zLZwNv

  export let value;

  const uniqueID = Math.floor(Math.random() * 100);

  function handleClick() {
    value = !value;
  }
</script>

<div class="s s--slider">
  <button
    role="switch"
    aria-checked={value}
    aria-labelledby={`switch-${uniqueID}`}
    on:click={handleClick}
  />
</div>

<style>
  :root {
    --accent-color: CornflowerBlue;
    --gray: #ccc;
  }

  /* Slider Design Option */

  .s--slider {
    display: flex;
    align-items: center;
  }

  .s--slider button {
    width: 3em;
    height: 1.6em;
    position: relative;
    margin: 0 0 0 0.5em;
    background: var(--gray);
    border: none;
  }

  .s--slider button::before {
    content: "";
    position: absolute;
    width: 1.3em;
    height: 1.3em;
    background: #fff;
    top: 0.13em;
    right: 1.5em;
    transition: transform 0.3s;
  }

  .s--slider button[aria-checked="true"] {
    background-color: var(--accent-color);
  }

  .s--slider button[aria-checked="true"]::before {
    transform: translateX(1.3em);
    transition: transform 0.3s;
  }

  /* Slider Design Option */
  .s--slider button {
    border-radius: 1.5em;
  }

  .s--slider button::before {
    border-radius: 100%;
  }
</style>
