function handelScroll(anchorId) {
  let anchorElement = document.getElementById(anchorId);
  if (anchorElement) {
    anchorElement.scrollIntoView();
  }
}

export default handelScroll;