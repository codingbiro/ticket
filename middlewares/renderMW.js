// Rendereli az oldalt

module.exports = function render(viewName) {
  return function renderMW(req, res) {
    return res.render(viewName, res.locals);
  };
};
