# jsInterface
OOP interface implementation

---
## Definitions
+ **Interface**  - entity, declares methods which Implementations must provide.
+ **Implementation** - entity, provides functional for methods declared by Interface.

## Main ideas
1. *To be convinient with Duck typing* - check methods existance only when called, and not when Interface or Implementation created / defined.
1. Bind context of methods to Interface maintainer - Object with property contained Interface.

## Quick intro
Just a simple basic example. You can find usage instructions below it.
```js
// creating Interface declares `.say(..)` and `.greet(..)` methods
const Speaking = new jsInterface(['say','bye']);

// Implementation with `.say(msg)` method
const speakEnglish = {
    say: function(msg) {
        return `${this.name} says: ${msg}`;
    }
};
const Duck = {name:'Donald'};   // Object maintainer for our Interface
Speaking(Duck,'speak');         // Duck.speak Interface property
Duck.speak.say('hello');        // ReferenceError: no Implementation yet
Duck.speak = speakEnglish;      // pointing Implementation to Interface
Duck.speak.say('hello');        // -> Donald says: hello

// another Implementation with extra method
const speakRussian {
    say: function(msg) {
        return `${this.name} говорит: ${msg}`;
    },
    greet: function(){
        return `${this.name} здоровается!`;
    }
};
Duck.speak = speakRussian;      // changing Implementation
Duck.speak.say('hello');        // -> Donald говорит: hello
Duck.speak.greet();             // TypeError: `.greet(..)` is not declared in `Speaking`
Duck.speak.bye()                // ReferenceError: `.bye(..)` is not defined in `speakRussian`
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

    You can declare one or list of methods:
    ```js
    const Speaking = new jsInterface('say');
    const Speaking = new jsInterface(['say','greet']);
    ```

    Or define default Implementation - all of it's methods will be declared in Interface:
    ```js
    const Speaking = new jsInterface({ // as simple Object
        say : function(msg) {
            return `${this.name} says: ${msg}`;
        }
        ,greet : function(){
            return `${this.name} greets everybody!`;
        }
    });
    const Speaking = new jsInterface(function(){ // as Constructor / Class
        this.say = function(msg){
            return `${this.name} says: ${msg}`;
        }
        this.greet = function(){
            return `${this.name} greets everybody!`;
        }
    });

    ```
2. Defining the property with Interface.

    You can define the property of simple object
    ```js
    const Duck = {};
    Speaking(Duck,'speak');
    ```
    or `this` in constructor
    ```js
    class Bird {
        constructor() {
            Speaking(this,'speak');
        }
    };
    const Duck = new Bird();
    ```
    in both of this examples `Duck.speak` property will contain *Interface*;
3. Pointing the Implementation
    
    Implementation must be an object or Constructor.

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
    You can reassign implementations to change Interface methods behavior. You should assign implementation at least once, if default implementation was not defined.
    
    Declared methods checks at calling only, and not in assignment. Every extra methods will be skiped.
