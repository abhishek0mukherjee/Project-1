var config = {
    apiKey: "AIzaSyD2O0mFIFPWg0ujWbqwyk20dbpnHA77-Pc",
    authDomain: "my-virtual-fridge.firebaseapp.com",
    databaseURL: "https://my-virtual-fridge.firebaseio.com",
    storageBucket: "my-virtual-fridge.appspot.com",
    messagingSenderId: "639848607205"
};

firebase.initializeApp(config);
var database = firebase.database();
var firstArray = [];

$(document).on("click"  , ".delete" , function (snapshot) {
var selectedItem = $(this).attr('data-buttons');
database.ref().orderByChild("Input").equalTo(selectedItem).once('value', function(snapshot){
        snapshot.forEach(function(data) {
        database.ref(data.key).remove();
  });
});

});

$("#clear-button").on("click" , function () {

$("#flex-box").remove();

 database.ref().remove();

  });

database.ref().on("child_added", function(snapshot) {
    firstArray.push(snapshot.val().Input);
    $("#flex-box").empty();
    for (i = 0; i < firstArray.length; i++) {
        var container = $('<div class="button-item">');
        container.addClass(firstArray[i]);
        var items = $('<div class="item">');
        items.text(firstArray[i]);
        var del = $('<p class="delete">' + "X" + '</p>');
        del.attr('data-buttons', firstArray[i]);
        container.append(del);
        container.append(items);

        $("#flex-box").prepend(container);
    }



    $('.button-item').on('click', function(event) {
        $(this).toggleClass('button-item-selected');
    });
    $(document).on("click", ".delete", function() {
        var itemID = $(this).attr('data-buttons');
        $("." + itemID).empty();
    });
    arraytest = JSON.stringify(firstArray);
    request(arraytest);
});

$("#mainInput").on(function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        var input = $("#mainInput").val().trim();
        $("#mainInput").val("");
        database.ref().push({
            Input: input,
        });
    }
});

$("#add-button").on("click", function() {
    event.preventDefault();
    if ($("#mainInput").val() != "") {
        var input = $("#mainInput").val().trim();
        $("#mainInput").val("");
        database.ref().push({
            Input: input,

        });
    } else {

        $(document.body).append("<div class='shadow' id='shadow' style='position:fixed;left:0px;top:0px;width:100%; height:100%; background:gainsboro; opacity: 0.4;'></div>");
        $(".windows-popup").show(100);
        $("#pop-button").on("click", function() {
            $(".windows-popup").hide();
            $("#shadow").remove();
        });
    }
});

$("#login-icon").click(function () { 
    firebase.auth().onAuthStateChanged(firebaseUser => {
     if (firebaseUser) {
     console.log("Your not allowed in (you're already logged in)!");
    } 
    else {
    formRedux();
}
});

});

function formRedux() {
    $(document.body).append("<div id='shadow' class='shadow' style='position:fixed;left:0px;top:0px;width:100%; height:100%; background:gainsboro; opacity: 0.4;'></div>");

    $("#popupContact").show(100);
    //Login Users 
    const auth = firebase.auth()
    $("#submit-signUp").click(
        function() {
            var email = $("#email-input").val();
            var pass = $('input:password').val();
            const promise = auth.createUserWithEmailAndPassword(email, pass).then(function() {
                 if  ( window.console) {
                        $(".shadow").remove();
                        $("#popupContact").hide();
                        $("#email-input").val("");
                        $('input:password').val("");
                      }     

                    });
        });

    $("#submit-login").click(
        function() {
            var email = $("#email-input").val();
            const pass = $('input:password').val();
            const promise = auth.signInWithEmailAndPassword(email, pass).then(function (firebaseUser) {       
              if (window.console ) {
                // promise.catch(e => console.log(e.message));
                $("#shadow").remove();
                $("#popupContact").hide();
                $("#email-input").val("");
                $('input:password').val("");
              }
              else {
                $('<div class="alert"> There seems to be a problem </div>')
              }
            });
        });

    $("#submit-logout").on("click", function() {
        auth.signOut().then(function() {
            $("#shadow").remove();
            $("#popupContact").hide();
            $("#email-input").val("");
            $('input:password').val("");
             window.close();
              $(document.body).append("<div id='shadow' class='shadow' style='position:fixed;left:0px;top:0px;width:100%; height:100%; background:gainsboro; opacity: 0.4;'></div>");
          
        });


    });


};

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
     // console.log(firebaseUser);
    } else {
        formRedux();
    }

});

//stringify the ingredients array(getting [])
// var ingredients = JSON.stringify(firstArray);
// document.getElementById("demo").innerHTML = ingredients;
// console.log(ingredients)


//stringify using test array for functionality
var testarray = ["eggs", "milk", "butter"];
var ingredients = JSON.stringify(testarray);
//document.getElementById("demo").innerHTML = ingredients;//test display
// console.log(ingredients)
console.log(firstArray);
var arraytest = JSON.stringify(firstArray);
//console.log("arraytest: " + arraytest);


function request(arraytest) {
    // //recipe request, printing to console
    $.ajax({
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients',
        type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
        data: {ingredients: arraytest}, //JSON.stringify({testarray}), //Additional parameters here
        dataType: 'json',
        success: function(data) {

            // var data2 = JSON.stringify(data);
            // var recipes = data2;
            // document.getElementById("demo").innerHTML= data2;
            //console.log((data)); 
            for(var i = 0; i<data.length; i++){
                var item = data[i];
                var title = item.title;
                var image = item.image;
                var id = item.id;
                console.log(title, image);
                $('#demo').append('<h1>'+title+'</h1>');
                $('#demo').append('<img src="'+image+'">');
                //$('#demo').append('<p>' + id + '</p>');
                $('#demo').append('<br>');

                    function calories(){
//var id = ["653352"]
//var ID = JSON.stringify(id)
var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + id + "/information?includeNutrition=true";
$.ajax({
    //url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/quickAnswer',
    //url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/{id}/information',
    url: queryURL,
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {id: id}, //{},  // Additional parameters here
    dataType: 'json',
    success: function(response) { 
        // document.getElementById("demo2").innerHTML = data;
        //console.log((response));
        console.log(response.sourceURL);
        
        for(var j = 0; j<response.length; j++){
                var items = response[j];
                var sourceURL = items.sourceURL;
                var nutrition = items.nutrition;
                var testsource = JSON.stringify(sourceURL);
                console.log(testsource);
                console.log(sourceURL);
                $('#demo').append(sourceURL);
                $('#demo').append(nutrition);


            }//end for loop  

         }, // end success
    error: function(err) { alert(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "OeA9zYKXGCmshtbXfBTFYCxry6BWp1HRLTzjsn8QLMm8dbmC0H"); // Enter here your Mashape key
    }
 })
};
 calories();

            }// end of for loop

        },//end of success
            error: function(err) { alert(err); },
            beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "OeA9zYKXGCmshtbXfBTFYCxry6BWp1HRLTzjsn8QLMm8dbmC0H"); // Enter here your Mashape key
        }
    });
}










//  function calories(){

// $.ajax({
//     url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/quickAnswer?q=How+many+calories+in+an+apple',
//     //url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/{id}/information',
//     type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
//     data: {}, //{answer: inputValu}, // Additional parameters here
//     dataType: 'json',
//     success: function(data) { 
//         //document.getElementById("demo2").innerHTML = data;
//         // $("demo").append()
//         console.log((data)); },
//     error: function(err) { alert(err); },
//     beforeSend: function(xhr) {
//     xhr.setRequestHeader("X-Mashape-Authorization", "OeA9zYKXGCmshtbXfBTFYCxry6BWp1HRLTzjsn8QLMm8dbmC0H"); // Enter here your Mashape key
//     }
//  })
// };

// calories();

// $("#mainInput").on(function(e) {
//     if (e.keyCode === 13) {
//         getAnswer();

//     }
//     });

// function getRecipes(){
//     // var inputVal = $('testarray').value;
//     var inputVal = testarray;
//     console.log("inputVal: " + inputVal);
//     var upToIngredients = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=';
//     var afterIngredients = '&number=200&mashape-key=OeA9zYKXGCmshtbXfBTFYCxry6BWp1HRLTzjsn8QLMm8dbmC0H'

//     var fridge = new XMLHttpRequest();
//     fridge.open("GET", upToIngredients + inputVal + afterIngredients, false)
//     fridge.send();
//     console.log(fridge.response);

//     var recipes = JSON.parse(fridge.response);

// }

//  getRecipes();