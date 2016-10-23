# jsInterface
OOP interface implementation

---
## Definitions
+ **Interface**  - entity, declares attributes which Implementations must provide.
+ **Implementation** - entity, provides functional for attributes declared by Interface.

## Main ideas
1. *To be convinient with **Duck typing*** - check attribute existance only when called, and not when Interface or Implementation created / defined.
1. Bind context of attributes to Interface maintainer - Object with property contained Interface.

## Quick intro
```js
const Speaking = new jsInterface(['say','bye']); // create Interface requires .say and .greet attributes from implementations
const speakEnglish = { // Implementation with .say(msg) method
    say: function(msg) {
        return `${this.name} says: ${msg}`;
    }
};
const Duck = {name:'Donald'}; // Object which will be maintainer for our Interface
Speaking.define(Duck,'speak'); // Duck.speak - property contained Interface
Duck.speak.say('hello'); // ReferenceError because Interface has no Implementation yet
Duck.speak = speakEnglish; // pointing Implementation for Interface
Duck.speak.say('hello'); // -> Donald says: hello

const speakRussian = { // another Implementation with extra attribute
    say: function(msg) {
        return `${this.name} говорит: ${msg}`;
    }
    ,greet: function() {
        return `${this.name} здоровается`
    }
};
Duck.speak = speakRussian; // changing Implementation
Duck.speak.say('hello'); // -> Donald говорит: hello
Duck.speak.greet(); // TypeError because Duck.speak.greet is undefined (not declared in Speaking)
Duck.speak.bye() // ReferenceError because Duck.speak.bye is not found in speakRussian
```

## Install
jsInterface avilable on npmjs
```bash
npm install --save js-interface
```
```js
const jsInterface = require('js-interface');
```
## Usage
1. Creating new jsInterface 

    You can define one or list of attributes:
    ```js
    const Speaking = new jsInterface('say');
    const Speaking = new jsInterface(['say','greet']);
    ```

    Or define default implementation:
    ```js
    const Speaking = new jsInterface(function(){ // as Constructor or Class
        this.say = function(msg){
            return `${this.name} says: ${msg}`;
        }
        this.greet = function(){
            return `${this.name} greets everybody!`;
        }
    });
    const Speaking = new jsInterface({ // as simple Object
        say : function(msg) {
            return `${this.name} says: ${msg}`;
        }
        ,greet : function(){
            return `${this.name} greets everybody!`;
        }
    });
    ```
2. Defining the Interface to property

    You can define the property of simple object
    ```js
    const Duck = {};
    Speaking.define(Duck,'speak');
    ```
    or `this` in constructor
    ```js
    class Bird {
        constructor() {
            Speaking.define(this,'speak');
        }
    };
    const Duck = new Bird();
    ```
    in both of this examples `Duck.speak` - will contain *Interface*;
3. Pointing the Implementation
    
    Implementation must be an object.

    To point the implementation for interface - assign it:
    ```js
    cosnt speakEnglish = {
        say : function(msg) {
            return `${this.name} says: ${msg}`;
        }
        ,greet : function(){
            return `${this.name} greets everybody!`;
        }
    };
    Duck.speak = speakEnglish;
    ```
    You can reassign implementations to change Interface attributes behavior. You should assign implementation at least once, if default implementation was not defined.
    
    Declared attributes checks at calling only, and not in assignment. Every extra attributes are dropped.