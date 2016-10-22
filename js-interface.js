'use strict';

function jsInterface(input) {
    let defaultImplementation;
    let interfaceProperties;
    switch(typeOfObject(input)) {
        case 'String' :
            interfaceProperties = [input];
            defaultImplementation = createObjectOfErrors(interfaceProperties);
            break;
        case 'Array' :
            interfaceProperties = input.slice();
            defaultImplementation = createObjectOfErrors(interfaceProperties);
            break;
        case 'Function' :
            defaultImplementation = new input();
            interfaceProperties = Object_keysWithInherited(defaultImplementation);
            break;
        case 'Object' :
            defaultImplementation = input;
            interfaceProperties = Object_keysWithInherited(defaultImplementation);
            break;
        default: throw new Error('jsInterface accept only String, Array, Function or Object.');
    };
    function createObjectOfErrors(methodList) {
        const obj = {};
        for (let i of methodList) {
            obj[i] = function(){ throw new Error(`${i} is not implemented in interface`) };
        };
        return obj;
    };
    function Object_keysWithInherited(obj) {
        let keys = [];
        for (let i in obj) {
            keys.push(i);
        };
        return keys;
    };
    
    function jsInterface_define(context,name) {
        jsInterface_connect(context,name,defaultImplementation);
    };
    function jsInterface_connect(context,name,implementation) {
        if (typeOfObject(implementation) !== 'Object') throw new Error('You should connect Object');
        const wrappedImplementation = wrapWithContext(context,implementation);
        jsInterface_defineProperty(context,name,wrappedImplementation);
    };
    function wrapWithContext(context,implementation) {
        const wrappedImplementation = {};
        for (let i of interfaceProperties) {
            wrappedImplementation[i] = function() {
                if (typeof implementation[i] === 'undefined') throw new Error(`Method ${i} is not found in implementation`);
                implementation[i].apply(context,...arguments);
            };
        };
        return wrappedImplementation;
    };
    function jsInterface_defineProperty(context,name,implementation) {
        Object.defineProperty(context,name,{
            configurable: true,
            get: function(){return implementation;},
            set: function(value){
                jsInterface_connect(this,name,value);
            }
        });
    }

    function Interface(){
        this.define = jsInterface_define;
    };
    return new Interface;
};


function typeOfObject(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
};

module.exports = jsInterface;