'use strict';

const assert = require('assert');
const jsInterface = require('../')

const speakEnglishConstructor = function(){
    this.say = function(msg){
        return `${this.name} says: ${msg}`;
    }
    this.greet = function(){
        return `${this.name} greets everybody!`;
    }
}
const speakEnglish = Object.assign({},new speakEnglishConstructor());
const speakRussianConstructor = function(){
    this.say = function(msg) {
        return `${this.name} говорит: ${msg}`;
    };
    this.greet = function(){
        return `${this.name} приветствует всех!`;
    };
};
const quacking = {
    quack:function(){
        return `${this.name} quacks.`;
    }
    ,greet:function() {
        return `${this.name} quack, quack`; // means "Hello" on ducks language
    }
}

describe('Interface created with properties',()=>{
    describe('1 as single String',()=>{
        testcase('say');
    });
    describe('as Array',()=>{
        it('+ should have methods for whole poperties list',()=>{
            const Duck = {name:'Donald'};
            const Speaking = new jsInterface(['say','greet']);
            Speaking(Duck,'speak');
            assert.ok(Duck.speak['say']);
            assert.ok(Duck.speak['greet']);
        });
        testcase(['say','greet']);
        it('+ should use common behavior whith presented methods, even if implementation is not strict',()=>{
            const Duck = {name:'Donald'};
            const Speaking = new jsInterface(['say','greet']);
            Speaking(Duck,'speak');
            Duck.speak = quacking;
            assert.equal(Duck.speak.greet(),'Donald quack, quack');
        });
    });
    
    function testcase(jsInterfaceArgument) {
        const Speaking = new jsInterface(jsInterfaceArgument);
        let Duck;

        beforeEach(()=>{
            Duck = {name:'Donald'};
            Speaking(Duck,'speak');
        })
        
        it('should call implementation (as simple Object) method with defined context',()=>{
            Duck.speak = speakEnglish;
            assert.equal(Duck.speak.say('hello'),'Donald says: hello');
        });
        it('should provide the same behavior with Constructor given as implementation',()=>{
            Duck.speak = speakEnglishConstructor;
            assert.equal(Duck.speak.say('hello'),'Donald says: hello');
        });
        it('should throw Error when calling method if implementation is not assigned',()=>{
            assert.throws(()=>{ Duck.speak.say('hello') },ReferenceError);
        });
        it('should change implementation by assignment',()=>{
            Duck.speak = speakEnglish;
            assert.equal(Duck.speak.say('hello'),'Donald says: hello');

            Duck.speak = new speakRussianConstructor();
            assert.equal(Duck.speak.say('привет'),'Donald говорит: привет');
        });
        it('should have declared property throwing error when calling property which implementation don\'t has',()=>{
            Duck.speak = quacking;
            assert.throws(()=>{ Duck.speak.say('hello') },ReferenceError);
        });
        it('should not have extra properties from implementation',()=>{
            Duck.speak = quacking;
            assert.equal(typeof Duck.speak.quack,'undefined');
        });
    }

});

describe('Interface created with default implementation',()=>{
    describe('as Object',()=>{
        testcase(speakEnglish);
    });
    describe('as Constructor',()=>{
        testcase(speakEnglishConstructor);
    });

    function testcase(jsInterfaceArgument) {
        const Speaking = new jsInterface(jsInterfaceArgument);
        let Duck;

        beforeEach(()=>{
            Duck = {name:'Donald'};
            Speaking(Duck,'speak');
        })
        
        it('should not throw Error when calling method if non-default implementation is not assigned',()=>{
            assert.doesNotThrow(()=>{Duck.speak.say('hello')});
        });
        it('should call implementation methods with defined context',()=>{
            assert.equal(Duck.speak.say('hello'),'Donald says: hello');
        });
        it('should call implementation (as constructed Object) methods with defined context',()=>{
            Duck.speak = new speakRussianConstructor();
            assert.equal(Duck.speak.say('привет'),'Donald говорит: привет');
        });
        it('should change implementation by assignment',()=>{
            assert.equal(Duck.speak.say('hello'),'Donald says: hello');

            Duck.speak = new speakRussianConstructor();
            assert.equal(Duck.speak.say('привет'),'Donald говорит: привет');
        });
        it('should have declared property throwing error when calling property which implementation don\'t has',()=>{
            Duck.speak = quacking;
            assert.throws(()=>{ Duck.speak.say('hello') },ReferenceError);
        });
        it('should not have extra properties from implementation',()=>{
            Duck.speak = quacking;
            assert.equal(typeof Duck.speak.quack,'undefined');
        });
        it('should use common behavior whith presented methods, even if implementation is not strict',()=>{
            Duck.speak = quacking;
            assert.equal(Duck.speak.greet(),'Donald quack, quack');
        });
    }
    
});