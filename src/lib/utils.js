const NODE_TYPE_DOCUMENT = 9;

function getScrollbarWidth() {

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;

}

function getParentByClass (element, className, self) {
  element = self && element || element.parentNode;
  while(element && element.nodeType !== NODE_TYPE_DOCUMENT && !element.classList.contains(className)) {
    element = element.parentNode;
  }
  return element;
}

export {
  getScrollbarWidth,
  getParentByClass
};
