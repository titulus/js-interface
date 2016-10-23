'use strict';

function jsInterface(input) {
    let initialImplementation;
    let interfaceProperties;
    let maintainer;
    let propertyContainerName;
    switch(classOf(input)) {
        case 'String' :
            interfaceProperties = [input];
            initialImplementation = createObjectOfErrors(interfaceProperties);
            break;
        case 'Array' :
            interfaceProperties = input.slice();
            initialImplementation = createObjectOfErrors(interfaceProperties);
            break;
        case 'Function' :
            initialImplementation = new input();
            interfaceProperties = Object_keysWithInherited(initialImplementation);
            break;
        case 'Object' :
            initialImplementation = input;
            interfaceProperties = Object_keysWithInherited(initialImplementation);
            break;
        default:
            throw new TypeError('jsInterface accept only String, Array, Function or Object.');
    };
    function createObjectOfErrors(methodList) {
        const obj = {};
        for (let i of methodList) {
            obj[i] = function(){
                throw new ReferenceError(`Implementation with method '${i}' is not assigned`);
            };
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
        maintainer = context;
        propertyContainerName = name;
        jsInterface_assign(initialImplementation);
    };
    function jsInterface_assign(input) {
        let implementation;
        switch(classOf(input)) {
            case 'Function' :
                implementation = new input();
                break;
            case 'Object' :
                implementation = input;
                break;
            default:
                throw new TypeError('You should assign Object or Constructor to property containing Interface');
        };
        const wrappedImplementation = wrapWithContext(implementation);
        jsInterface_defineProperty(wrappedImplementation);
    };
    function wrapWithContext(implementation) {
        const wrappedImplementation = {};
        for (let i of interfaceProperties) {
            wrappedImplementation[i] = function() {
                if (typeof implementation[i] === 'undefined')
                    throw new ReferenceError(`Method '${i}' is not found in implementation`);
                return implementation[i].apply(maintainer,arguments);
            };
        };
        return wrappedImplementation;
    };
    function jsInterface_defineProperty(implementation) {
        Object.defineProperty(maintainer,propertyContainerName,{
            configurable: true,
            get: function(){return implementation;},
            set: jsInterface_assign
        });
    }

    function Interface(){
        this.define = jsInterface_define;
    };
    return new Interface;
};


function classOf(variable) {
    return Object.prototype.toString.call(variable).slice(8, -1)
};

module.exports = jsInterface;