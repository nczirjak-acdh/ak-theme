/* AK: Overriding original check_itesm_statuses.js in bootstrap theme */
VuFind.register('itemStatuses', function ItemStatuses() {
  // AK: We don't (yet) use item statuses
  return false;
});
