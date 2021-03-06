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


     console.log(firebaseUser);


    } else {

        formRedux();


    }

});

const mashapeKey = "OeA9zYKXGCmshtbXfBTFYCxry6BWp1HRLTzjsn8QLMm8dbmC0H"
const spoonFoodEndPoint = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients="
const spoonFoodOptions = "&limitLicense=false&number=100&ranking=2"

function recipeSearch() {
    //empty variable arrays
    searchResultsLabels = [];
    searchResultsImages = [];
    searchResultsUrls = [];

    // Set up an independent ingredient array
    var fridge = firstArray;

    // Cycle through the fridge/ingredientsArray and remove any spaces from the ingredients names
    for (i=0; i<fridge.length; i++){
        if (fridge[i].indexOf(" ") === -1){
            //console.log("No spaces in the ingredient name.");
        } else {
            var alteredWord = fridge[i].replace(/ /g, "+");
            fridge[i] = alteredWord;
        }   
    }

    // Console log the progress
    console.log("Fixed spaces in the ingredients array.");
    console.log(fridge);

    // Now that the input is 'clean', start the ajax call for the recipes.
    $.ajax({
        url: spoonFoodEndPoint + fridge + spoonFoodOptions,
        method: "GET",
        headers: {
            "X-Mashape-Key": mashapeKey,
            "Accept": "application/json"
        }
    }).done(function (response){
        
        // When the search completes...
        console.log("success, spoonacular api queried.");
        console.log(response);

        // Get a random number from 0 - 90
        var randomNumber = Math.floor(Math.random() * 90);

        // Grab the first 10 results and add their id, title, and image urls to the variable arrays for them
        for (i=0; i<10; i++) {
            var recipeId = response[i + randomNumber].id;
            var recipeTitle = response[i +randomNumber].title;
            var recipeImage = response[i + randomNumber].image;
            searchResultsUrls.push("https://spoonacular.com/recipes/-" + recipeId);
            searchResultsLabels.push(recipeTitle);
            searchResultsImages.push(recipeImage);
            
            // Start the youtube query while passing the index to avoid the call times from changing the order
            youtubeApiQuery(recipeTitle, i);
        }
        
        // Console log the progress.
        console.log("Recipe results added to the correct arrays. Starting youtube link creation.")
        
        // Call the function to display the results to the screen.
        populateResults ();
    });
}

//Ajax calls

// $.ajax({
//     url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients', // The URL to the API. You can get this in the API page of the API you intend to consume
//     type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
//     data: {}, // Additional parameters here
//     dataType: 'json',
//     success: function(data) { console.dir((data.source)); },
//     error: function(err) { alert(err); },
//     beforeSend: function(xhr) {
//     xhr.setRequestHeader("X-Mashape-Authorization", "OeA9zYKXGCmshtbXfBTFYCxry6BWp1HRLTzjsn8QLMm8dbmC0H"); // Enter here your Mashape key
//     }
// });
