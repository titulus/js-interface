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
jsInterface.define = function(context,name,interface) {
  if (typeOfObject(interface) !== 'Function') throw new Error('You should define Function');
  const interface_example = new interface();
  for (let i in interface_example) {
    interface_example[i] = interface_example[i].bind(context);
  };
  jsInterface_defineProperty(context,name,interface,interface_example);
};
jsInterface_defineProperty = function(context,name,interface,implementation) {
  Object.defineProperty(context,name,{
    configurable: true,
    get: function(){return implementation;},
    set: function(value){
      jsInterface_connect(this,name,interface,value);
    }
  });
};
jsInterface_connect = function(context,name,interface,implementation) {
  if (typeOfObject(implementation) !== 'Object') throw new Error('You should connect Object');
  const interface_example = {};
  for (let i in (new interface)) {
    interface_example[i] = function(...args) {
      if (!implementation.hasOwnProperty(i)) throw new Error(`Method ${i} is not found in implementation`);
      implementation[i].apply(context,args);
    };
  };
  jsInterface_defineProperty(context,name,interface,interface_example);
};

function typeOfObject(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
};