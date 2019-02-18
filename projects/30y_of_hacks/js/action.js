/* exported popupCallback timelineGoToId */
/* globals goToBlock */

/*
 * Called by Tardy's timeline communication scripts.
 * Those scripts are included by my HTML.
 * If it's defined, it:
 * - Hides the classic timeline popup
 * - Receive the id (index) of the current event on every
 *   scroll event. -1 if no event is present on the timeline.
 */
function popupCallback(id) {
  // console.log(id, events[id]);
  if (id >= 0) goToBlock(id, true);
}

// Tell the timeline to go to an event.
function timelineGoToId(id) {
  // Not possible yet
  console.log("Timeline go to id:", id);
}
