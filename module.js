var name;
exports.setName = function(thyName) {
name = thyName;
};
exports.sayHello = function() {
console.log('Hello ' + name);
};
exports.getExports = function() {
	console.log("exports : " + exports);
	return exports;
}