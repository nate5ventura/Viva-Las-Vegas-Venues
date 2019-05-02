// create function to load page before .js runs:
$(document).ready(function() {

    //click event: for user click on casino cards, dynamicaly create the content to append to the class "modal-body"
    $(document).on("click", ".card", function() {
        //captures the data name of the card"
        var venueId = $(this).attr("data-id");
        getUpcomingEvents(venueId);
    });

    //click event: user click on Take a Look button (class=".show-video") to drop down the ".video-area" and call the playVideo function: 
    $(document).on("click", ".show-video", function() {
        //var divNumber = $(this).attr("id");
        //console.log(divNumber);
        $(this)
            .siblings(".video-area")
            .slideDown("slow");

        var title = $(this).attr("data-name");
        var buttonId = $(this).attr("id");
        playVideo(title, buttonId);
    });

    // fucntion to pull the events API from Seatgeek, and dynamically create the events in the modal:
    function getUpcomingEvents(venueId) {
        // API Key: MTYzNjIxNzR8MTU1NjEyMjE2OC41OQ
        // Use ajax to pull data from the events API:
        var clientID = "MTYzNjIxNzR8MTU1NjEyMjE2OC41OQ";

        var queryUrl =
            "https://api.seatgeek.com/2/events?venue.id=" +
            venueId +
            "&client_id=" +
            clientID;

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response) {
            //create variable name for the data response received from API:
            var eventResponse = response.events;
            // empty out the eventlist first:
            $(".events-list").empty();

            //loop through the response array to find the needed items:
            for (let i = 0; i < eventResponse.length; i++) {
                var title = response.events[i].title;
                var date = response.events[i].datetime_local;
                var tickets = response.events[i].url;

                // new div for events:
                var eventDiv = $("<div>");
                // add class:
                eventDiv.addClass("container rounded event-container");
                // create an event elements for Title:
                eventTitle = $("<h3>");
                eventTitle.text("What's on: " + title);
                 // create an event elements for Date:
                eventDate = $("<p>");
                eventDate.text("Date: " + date);
                // create a link to buy tickets:
                eventTickets = $("<a>").attr("href", tickets);
                eventTickets.addClass("ticket-link");
                eventTickets.attr("target", "_blank");
                eventTickets.text("Buy Tickets");
                // create a page break:
                var br = $("<br>");
                // create a button to show the video:
                var videoButton = $('<button id="'+ i +'" />');
                videoButton.addClass("topic-btn rounded gif-button show-video");
                videoButton.attr("data-name", title);
                videoButton.text("Take a look!");

                // add div to contain the youtube video, with different id's for each div created:
                var videoBox = $('<div id="div' + i +'" />');
                // add class to hide the div for youtube video:
                videoBox.addClass("video-area hide");

                // append the above variables to the eventDiv container:
                eventDiv.append(
                    eventTitle,
                    eventDate,
                    eventTickets,
                    br,
                    videoButton,
                    videoBox
                );

                // append the eventDiv to the HTML class "events-list":
                $(".events-list").append(eventDiv);

            }

        });

    }

    // function to pull the video from the YouTube:
    function playVideo(title, buttonId) {
        // Use ajax to pull data from the YouTube API:
        var videoQueryUrl =
            "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" +
            title +
            "&key=AIzaSyCQMj92WO36JhFdxY5j4sQvPXPL5ACyp-I";

        $.ajax({
            url: videoQueryUrl,
            method: "GET"
        }).then(function(response) {
            //create variable name for the data response received from API:
            var YTID = response.items[0].id.videoId;
            //call the YouTube iFrame function:
            onYouTubeIframeAPIReady(YTID, buttonId);
        });
    }

    // function for the YouTube player: 
    function onYouTubeIframeAPIReady(YTID, buttonId) {
        console.log("div" + buttonId);
        player = new YT.Player("div" + buttonId, {
            height: "40%",
            width: "100%",
            videoId: YTID,
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        
        });
    }

    // The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // the API calls this function when the player's state changes.
    // the function indicates that when playing a video (state=1),
    // the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
    }

    function stopVideo() {
        player.stopVideo();
    }

});
