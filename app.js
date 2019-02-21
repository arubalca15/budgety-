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
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum; // this will fill in the totals that are initially zero
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        
         calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
             data.budget = data.totals.inc - data.totals.exp;
             //Calculate percentage of income we make
             if(data.totals.inc > 0) {
                 
                 data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100); } else{
                 data.percentage = -1;
             }
         },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
})();

//UI CONTROLLER

var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
        
    };
    
    return {
        getinput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)// parseFloat converts a string to a floating decimal 
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
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);//querySelectorAll does not return an array but a list. This means we do not get access to the method associated with arrays.
            
            fieldsArr = Array.prototype.slice.call(fields);// we have to use slice to make a copy of an array. We use the call method to get the list from var fields to make a copy in an array. THIS MAKES AN ARRAY 
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";// this clears the fields
            });//instead of using a forlopp we use the forEach method to pass a callback function through each index of the array 
            
            fieldsArr[0].focus(); // this puts the cursor back to description
        },
        
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
        },
        
        getDOMstrings : function() {
            return DOMstrings;
        },
        
        testing: function() {
            console.log(data);
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
    
    var updateBudget = function() {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }; // updates the bugdet everytime we input something
     
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getinput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {  //this checks if the input is a number,
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); // we grab out input from the 1st step and create a new item 

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type); 

            // 4. Clear the fields

            UICtrl.clearFields();

            // 5. Calculate the budget

            // 6. Display the budget on the UI 
        }
    }; // THIS IS THE FUNCTION THAT IS USED WHEN THE ENTER KEY IS PRESSED 
    
    
    
    return {
        init: function() {
            setupEventListeners();
        }
    };
    
        

})(budgetController, UIController);

controller.init(); 
