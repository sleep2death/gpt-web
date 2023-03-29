export function longpress(node) {
  const TIME_MS = 500;
  let timeoutPtr;

  window.oncontextmenu = function() { return false; }

  node.addEventListener('mousedown', handleMouseDown);
  node.addEventListener('touchstart', handleTouchStart);

  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("touchend", handleMouseUp);

  function handleMouseDown(evt) {
    if (timeoutPtr) {
      clearTimeout(timeoutPtr)
    }

    timeoutPtr = setTimeout(() => {
      timeoutPtr = null

      node.dispatchEvent(new CustomEvent('longpressed'));
      console.log(evt)
    }, TIME_MS);
  }

  function handleMouseUp() {
    clearTimeout(timeoutPtr)
  }

  function handleTouchEnd() {
    clearTimeout(timeoutPtr)
  }

  function handleTouchStart(evt) {
    timeoutPtr = setTimeout(() => {
      timeoutPtr = null

      node.addEventListener("touchend", handleTouchEnd);
      node.dispatchEvent(new CustomEvent('longpressed', { detail: evt.touches[0] }));
    }, TIME_MS);
  }

  return {
    destroy: () => {
      clearTimeout(timeoutPtr)
      node.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchStart);

      node.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      // node.removeEventListener('mousedown', handleMouseDown);
      // window.removeEventListener('mouseup', handleMouseUp);
      // window.removeEventListener('mousemove', handleMouseUp);
    }
  };
}
