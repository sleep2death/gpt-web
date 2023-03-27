export function longpress(node) {
	const TIME_MS = 500;
  let pressed = false;
	let timeoutPtr;

	function handleMouseDown(e) {
    if (pressed) return
    pressed = true

	  window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mousemove', handleMoveBeforeLong);

		timeoutPtr = window.setTimeout(() => {
			window.removeEventListener('mousemove', handleMoveBeforeLong);
			node.dispatchEvent(new CustomEvent('longpressed'));
			// TODO - ideally make this not trigger long press again
			setTimeout(() => node.dispatchEvent(e), 0);
		}, TIME_MS);
	}

	function handleMoveBeforeLong(e) {
		window.clearTimeout(timeoutPtr); 
		window.removeEventListener('mousemove', handleMoveBeforeLong);
	}

	function handleMouseUp(e) {
    pressed = false

		window.clearTimeout(timeoutPtr); 
		window.removeEventListener('mousemove', handleMoveBeforeLong);
	  window.removeEventListener('mouseup', handleMouseUp);

		node.dispatchEvent(new CustomEvent('longpressup'));
	}

  // add event listeners
	node.addEventListener('mousedown', handleMouseDown);

	return {
		destroy: () => {
			node.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mousemove', handleMouseUp);
		}
	};
}
