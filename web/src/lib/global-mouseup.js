export default function GlobalMouseUp(node) {
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchend", onMouseUp);

  function onMouseUp() {
    node.dispatchEvent(new CustomEvent("stopped"));
  }

  return {
    destroy: () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);
    },
  };
}
