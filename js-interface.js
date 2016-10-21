function jsInterface(method_variable) {
  let methods;
  switch(typeOfObject(method_variable)) {
    case 'Array' : methods = method_variable; break;
    case 'String' : methods = [method_variable]; break;
    default: throw new Error('method_variable must be an Array or String');
  }
  function Interface(){
    for (let i of methods) {
      this[i] = function(){ throw new Error(`${i} is not implemented in interface`) };
    }
  };  
  return Interface;
};
jsInterface.implements = function(interfaceOrArrayOfInterfaces,implementation) {
  let parentInterface;
  switch(typeOfObject(interfaceOrArrayOfInterfaces)) {
    case 'Array' : parentInterface = Object.assign.apply([],interfaceOrArrayOfInterfaces); break;
    case 'Function' : parentInterface = interfaceOrArrayOfInterfaces; break;
    default: throw new Error('parentInterface_variants must be an Array or Constructor');
  }
  function Implementation(){
    for (let method in (new parentInterface)) {
      if (!implementation[method]) {
        throw new Error(`method ${method} is not found in implementation`);
      }
      this[method] = implementation[method];
    };
  };
  return Implementation;
};
jsInterface.define = function(context,name,newInterface_variable) {
  let interface_example;
  switch(typeOfObject(newInterface_variable)) {
    case 'Object' : interface_example = Object.assign({},newInterface_variable); break;
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
      for (let method in interface_example[name]) {
        if (!value[method]) throw new Error(`method ${method} is not found in implementation`);
      }
      jsInterface.define(this,name,value);
    }
  });
};

function typeOfObject(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}