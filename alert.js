module.exports = function Alert(message) {
  if (!window.Materialize)
    return alert(message);

  Materialize.toast(message, 5000, 'rounded');
};
