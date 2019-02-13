//BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    
    var totalExpenses = 0;
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function(type, descript, val) {
            
            var newItem, ID;// ID  is the name for each new item
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;// This creates a new ID    
            }else {
                ID = 0; 
            }
            
            
            //This creates a new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, descript, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, descript, val);
            }
            
            data.allItems[type].push(newItem); //pushed it into our data structure
            return newItem; //returns the new element
        }
    }
})();

//UI CONTROLLER

var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__button',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list'
        
    };
    
    return {
        getinput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value 
            };   
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //Insert the Html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); //(where do we want to insert it, what we want to insert)
        },
        
        
        getDOMstrings : function() {
            return DOMstrings;
        }
        
    };
    
})();


//Global APP Controller

var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem(); 
            } // some older browsers use which instead of keyCode 
        }); // keypress is a predetermined word that tracts when a key is pressed 
    };
    
     
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getinput();
        
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value); // we grab out input from the 1st step and create a new item 
        
        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type); 
        // 4. Calculate the budget
        
        // 5. Display the budget on the UI 
        
    }; // THIS IS THE FUNCTION THAT IS USED WHEN THE ENTER KEY IS PRESSED 
    
    
    
    return {
        init: function() {
            setupEventListeners();
        }
    };
    
        

})(budgetController, UIController);

controller.init(); 