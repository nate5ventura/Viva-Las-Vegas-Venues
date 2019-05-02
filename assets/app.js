// create function to load page before .js runs:
$(document).ready(function() {
    //psuedocode:

    //1. on click event: for user click on casino cards, dynamicaly create the content to append to the class "modal-body"

    $(document).on("click", ".card", function() {
        //captures the data name of the card"
        var venueId = $(this).attr("data-id");
        getUpcomingEvents(venueId);
    });

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
            //log the resulting object
            console.log(response);

            $(".events-list").empty();

            //loop through the response array to find the needed items:
            for (let i = 0; i < eventResponse.length; i++) {
                var title = response.events[i].title;
                var date = response.events[i].datetime_local;
                var tickets = response.events[i].url;

                console.log(title);
                console.log(date);
                console.log(tickets);

                // new div for events:
                var eventDiv = $("<div>");
                eventDiv.addClass("container rounded event-container");
                //create an event element:
                eventTitle = $("<h3>");
                //attach text to the event element:
                eventTitle.text("What's on: " + title);

                eventDate = $("<p>");
                eventDate.text("Date: " + date);

                eventTickets = $("<a>").attr("href", tickets);
                eventTickets.addClass("ticket-link");
                eventTickets.attr("target", "_blank");
                eventTickets.text("Buy Tickets");

                var br = $("<br>");

                var videoButton = $("<button>");
                // add a class to button variable:
                videoButton.addClass("topic-btn rounded gif-button show-video");
                // add an attribute to button variable:
                videoButton.attr("data-name", title);
                // add text to button variable:
                videoButton.text("Take a look!");

                // add div to contain the youtube video:
                var videoBox = $("<div>");
                // add class to the div for youtube video:
                videoBox.addClass("video-area hide");
                videoBox.attr("id", "player");

                // append the above variables to the eventDiv container:
                eventDiv.append(
                    eventTitle,
                    eventDate,
                    eventTickets,
                    br,
                    videoButton,
                    videoBox
                );
                videoButton.on("click", function(event) {
                    var videoName = $(this).attr("data-name");
                    playVideo(videoName, videoButton, videoBox);
                });
                // append the eventDiv to the HTML class "events-list":
                $(".events-list").append(eventDiv);
                $(document).on("click", ".show-video", function() {
                    $(this)
                        .siblings(".video-area")
                        .slideDown("slow");
                });
            }
        });
    }

    function playVideo(title, videoButton, videoBox) {
        var videoQueryUrl =
            "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" +
            title +
            "&key=AIzaSyCGZCED449J3UvxPQRx_TbEpIi4nnesaZ8";
        $.ajax({
            url: videoQueryUrl,
            method: "GET"
        }).then(function(response) {
            var YTID = response.items[0].id.videoId;
            console.log(response);
            console.log(YTID);
            onYouTubeIframeAPIReady(YTID);
        });
    }

    function onYouTubeIframeAPIReady(YTID) {
        player = new YT.Player("player", {
            height: "40%",
            width: "100%",
            videoId: YTID,
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
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
