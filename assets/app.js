// create function to load page before .js runs:
$(document).ready(function() {



//psuedocode:

//1. on click event: for user click on casino cards, dynamicaly create the content to append to the class "modal-body"

$(document).on("click", ".card", function(){
    //captures the data name of the card"
    var venueId = $(this).attr("data-id");
    getUpcomingEvents(venueId);
});

//2. on click event: for user click on show video button under each upcoming event in the Modal.  This will open with slide down the YouTube video of that performer. 

$(document).on("click", ".show-video", function(){
    //var vidBox = $("<div>")
    //vidbox.attr()

    //$(".show-video").slideDown("fast");

    // (this).insertAfter()
    //getYouTubeVideos(title);
});



//3.  create function 

function getUpcomingEvents(venueId) {

    // API Key: MTYzNjIxNzR8MTU1NjEyMjE2OC41OQ
    // Use ajax to pull data from the events API:

    var clientID = "MTYzNjIxNzR8MTU1NjEyMjE2OC41OQ";

    var queryUrl = "https://api.seatgeek.com/2/events?venue.id=" + venueId + "&client_id=" + clientID;

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response) {
        //create variable name for the data response received from API:
        var eventResponse = response.events;
        //log the resulting object
        console.log(response); 

        $(".events-list").empty();

        //loop through the response array to find the needed items:
        for (let i=0; i < eventResponse.length; i++) {

            var title = response.events[i].title
            var date = response.events[i].datetime_local
            var tickets = response.events[i].url
            
    

            console.log(title);
            console.log(date);
            console.log(tickets);

            // new div for events:
            var eventDiv = $("<div>");
            //create an event element:
            eventTitle = $("<h3>");
            //attach text to the event element:
            eventTitle.text("What's on: "+ title);

            eventDate = $("<p>");
            eventDate.text("Date: "+ date);

            eventTickets = $("<a>").attr("href", tickets);
            eventTickets.attr("target", "_blank")
            eventTickets.text("Buy Tickets");

            var br = $("<br>");

            var videoButton = $("<button>");
            // add a class to button variable:
            videoButton.addClass("topic-btn rounded gif-button show-video");
            // add an attribute to button variable:
            videoButton.attr("data-name", title);
            // add text to button variable: 
            videoButton.text("Take a look!");
            

            eventDiv.append(eventTitle, eventDate, eventTickets, br, videoButton);

            $(".events-list").append(eventDiv);
        }

    })

}; 

/*
//4. create function 

getYouTubeVideos(title) {
    // Jonathans YouTube API Key: AIzaSyCQMj92WO36JhFdxY5j4sQvPXPL5ACyp-I
    // use ajax to pull data from the YouTube search API:

    var vidQueryUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + title + "&key={YOUR_API_KEY}";

     $.ajax({
        url: vidQueryUrl,
        method: "GET"
    }).then(function(response) {
        //create variable name for the data response received from API:
        var videoResponse = response.data;
        //log the resulting object
        console.log(video.Response);

    });

};

*/

});
