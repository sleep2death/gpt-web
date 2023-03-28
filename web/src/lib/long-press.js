export function longpress(node) {
  const TIME_MS = 500;
  let timeoutPtr;

  window.oncontextmenu = function() { return false; }

  let pressed = false

  node.addEventListener('mousedown', handleMouseDown);
  node.addEventListener('touchstart', handleTouchStart);

  function handleMouseDown() {
    timeoutPtr = setTimeout(() => {
      timeoutPtr = null
      pressed = true

      window.addEventListener("mouseup", handleMouseUp);
      node.dispatchEvent(new CustomEvent('longpressed'));
    }, TIME_MS);
  }

  function handleMouseUp() {
    if (timeoutPtr) {
      clearTimeout(timeoutPtr)
    }

    if (pressed) {
      pressed = false
      node.dispatchEvent(new CustomEvent('longpressup'));
    }

    window.removeEventListener("mouseup", handleMouseUp);
  }

  function handleTouchEnd() {
    if (timeoutPtr) {
      clearTimeout(timeoutPtr)
    }

    if (pressed) {
      node.dispatchEvent(new CustomEvent('longpressup'));
      pressed = false
    }
    node.removeEventListener("touchend", handleTouchEnd);
  }

  function handleTouchStart() {
    timeoutPtr = setTimeout(() => {
      timeoutPtr = null
      pressed = true

      node.addEventListener("touchend", handleTouchEnd);
      node.dispatchEvent(new CustomEvent('longpressed'));
    }, TIME_MS);
  }

  return {
    destroy: () => {
      console.log("destroyed")
      pressed = false

      clearTimeout(timeoutPtr)
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchStart);

      node.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      // node.removeEventListener('mousedown', handleMouseDown);
      // window.removeEventListener('mouseup', handleMouseUp);
      // window.removeEventListener('mousemove', handleMouseUp);
    }
  };
}
