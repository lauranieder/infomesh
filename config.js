// Modify this value to match the host directory structure
var ROOT_NAME = 'infomesh'

var ROOT = '/' + ROOT_NAME
var window = window || null
if (!window) {
  module.exports = { ROOT }
}