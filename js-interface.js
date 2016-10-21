function jsInterface(method_variable) {
  var methods;
  switch(Object.prototype.toString.call(method_variable).slice(8, -1)) {
    case 'Array' : methods = method_variable; break;
    case 'String' : methods = [method_variable]; break;
    default: throw new Error('method_variable must be an Array or String');
  }
  function Interface(){
    for (let i of methods) {
      this[i] = function(){ throw new Error(`${i} is not implemented in interface`) };
    }
  };
  Interface.__proto__ = this.constructor.prototype;
  
  return Interface;
};
jsInterface.implements = function(parentInterface_variants,implementation) {
  if (!parentInterface_variants) throw new Error(`parentInterface is not defined`);
  if (!implementation) throw new Error(`implementation is not defined`);
  var parentInterface;
  switch(Object.prototype.toString.call(parentInterface_variants).slice(8, -1)) {
    case 'Array' : parentInterface = Object.assign.apply([],parentInterface_variants); break;
    case 'Function' : parentInterface = parentInterface_variants; break;
    default: throw new Error('parentInterface_variants must be an Array or Constructor');
  }
  function Interface(){
    for (let method in (new parentInterface)) {
      if (!implementation[method]) {
        throw new Error(`method ${method} is not found in implementation`);
      }
      this[method] = implementation[method];
    };
  };
  Interface.__proto__ = this.prototype;
  return Interface;
};
jsInterface.define = function(context,name,newInterface_variable) {
  var interface_example;
  switch(Object.prototype.toString.call(newInterface_variable).slice(8, -1)) {
    case 'Object' : interface_example = newInterface_variable; break;
    case 'Function' : interface_example = new newInterface_variable(); break;
    default: throw new Error('newInterface_variable must be an Array or Constructor');
  };
  for (let i in interface_example) {
    interface_example[i] = interface_example[i].bind(context);
  };
  Object.defineProperty(context,name,{
    configurable: true,
    get: function(){return interface_example;},
    set: function(value){
      if (Object.prototype.toString.call(value).slice(8, -1) !== 'Object') throw new Error('Interface implementation exemple expected')
      for (let method in this[name]) {
        if (!value[method]) throw new Error(`method ${method} is not found in implementation`);
      }
      jsInterface.define(this,name,value);
    }
  });
};