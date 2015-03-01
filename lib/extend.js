var _extend = function(obj) {
	var forEach = Array.prototype.forEach;
	forEach.call(
		Array.prototype.slice.call(arguments, 1),
		function(source) {
		if (source) {
			for (var prop in source) {
				obj[prop] = source[prop];
			}
		}
	});
	return obj;
};

var extend = module.exports = function(protoProps, staticProps) {
	var parent = this;
//	var child = protoProps.constructor;
	var child = function(){
		return parent.apply(this, arguments);
	};

    _extend(child, parent, staticProps);
	var Surrogate = function() {
		this.constructor = child;
	};
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate();
    if (protoProps) _extend(child.prototype, protoProps);

	child.__super__ = parent.prototype;

	return child;
};