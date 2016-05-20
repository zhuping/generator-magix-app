define('app/models/manager', [
  'app/models/model',
  'magix'
], function (Model, Magix) {
  var M = Magix.Manager.create(Model)


  return M
})