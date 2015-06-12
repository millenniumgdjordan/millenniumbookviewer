/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
function submitForm() {
    var uname = $("[name='username']").val().trim();
    var _pass = $("[name='password']").val();
    Parse.User.logIn(uname.toLowerCase(), _pass, {
      success: function(user) {
        var belongsTo = user.get('belongsTo');
        window.localStorage['userBelongsTo'] = belongsTo;
        var userToken = user.get('username');
        window.localStorage['userToken'] = userToken;
        $("#groupselect_data").empty();
        if (belongsTo.length == 1) { 
            generateGroupPage(belongsTo[0]);
        } else {
            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#groupselect", { transition: "flip" } );
        }
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        $("#login_form_container").animate({left: '-=10px'}, 100);
        var i;
        for (i = 0; i < 3; i++) {
            $("#login_form_container").animate({left: '+=20px'}, 100);
            $("#login_form_container").animate({left: '-=20px'}, 100);
        }
        $("#login_form_container").animate({left: '+=10px'}, 100);
      }
    });
}

function buildGroupPage() {
    $("#groupselect_data").empty();
    var groupPageHTML ='';
    groupPageHTML += '<div class="ui-grid-a">';
    $.getJSON( "js/feed.json", function( json ) {
        $.each(json.buyinggroup, function (j, eventID) {
            var belongsto = window.localStorage.getItem('userBelongsTo');
            var imagepathroot = "images/groups/" + eventID.keyid + "/";
            var usercheck = belongsto.indexOf(eventID.keyid);
            if (usercheck > -1) {
                groupPageHTML += '<div class="uiblock centered"><a href="#" onclick="generateGroupPage(\'' + eventID.keyid + '\')"><img src="' + imagepathroot + 'logo_90px.png" width=90 /></a></div>';
            }
        });
        groupPageHTML += '</div>';
        $("#groupselect_data").append(groupPageHTML);
        $('.uiblock').each(function(i, el) {
            if (i % 2 === 0) { 
                $(this).addClass("ui-block-a"); 
            }
            else {
                $(this).addClass("ui-block-b");
            }
        });
    });
}

function logout() {
    window.localStorage.removeItem('userToken');
    //$.mobile.changePage("#login", {transition: "flip" } ); <--deprecated 
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#login", { transition: "flip" } );
}

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
       
        app.receivedEvent('deviceready');
        navigator.splashscreen.hide();
         // Resive video
    
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
    },
    
   
};


function generateGroupPage(groupname) {
    
    $("#chooser").css("display","block");
    //check for already existing pages and remove them
    if ($("div:jqmData(role='page')").hasClass("dynamicpage")) {
        $(".dynamicpage").remove();
    }
    var groupnameid = "#" + groupname;
    //generate Main Book Display
    $.getJSON( "js/feed.json", function( json ) {
        $.each(json.buyinggroup, function (i, buyinggroup) {
            if (buyinggroup.keyid == groupname) {
                var dynamichtml =  '<div data-role="page" data-theme="c" id="' + buyinggroup.keyid + '"> <div data-role=header data-theme=j class="ui-bar headerwithnav" data-id=myheader><div id=navleft><div id=navleft_wrapper><div id=navleft_icon><a href=#groupselect data-rel=back><i class="fa fa-chevron-left fa-2x"></i></a></div></div></div><div id=navcenter class=centered><div id=navcenter_wrapper><div id="navcenter_title"><h2 class="centered">' + json.buyinggroup[i].year[j].quarter[k].event[l].title  + '</h2></div></div></div><div id=navright><div id=navright_wrapper><div id=navright_icon><a href=#chooser><i class="fa fa-bars fa-2x"></i></a></div></div></div></div><div data-role="main" class="ui-content centered">';
                $.each(buyinggroup.year, function (j, eventyear) {
                    dynamichtml += '<h2>' + eventyear.keyid + '</h2>';
                    dynamichtml += '<div id="quarterwrapper" data-role="tabs"> <div id="quarternav" data-role="navbar"> <ul id="quarterlist"> <li><a href="#q1" data-theme="j" data-ajax="false" class="ui-btn-active">Q1</a></li> <li><a href="#q2" data-theme="j" data-ajax="false">Q2</a></li> <li><a href="#q3" data-theme="j" data-ajax="false">Q3</a></li> <li><a href="#q4" data-theme="j" data-ajax="false">Q4</a></li> </ul> </div>';
                    $.each(eventyear.quarter, function (k, quarter) {
                        dynamichtml += '<div id="' + quarter.keyid + '" class="ui-content" >';
                        if (quarter.event.length < 1) {
                            dynamichtml += '<h2>It looks like there\'s nothing here this quarter. <br /> Have you tried other quarters?</h2>';
                        } else {
                            $.each(quarter.event, function (l, eventview) {
                                dynamichtml += '<div class="onethird"><a href="#" onclick="generateCampaignPage(' + i + ',' + j + ',' + k + ',' + l + ')"><img class="eventicon" src="images/groups/' + buyinggroup.keyid + '/' + eventyear.keyid + '/' + quarter.keyid + '/' + eventview.keyid + '/eventicon300px@2x.png" /></a><div class="onethirdcaption"><p>' + eventview.title + '</p></div></div>';
                            });
                        }
                        dynamichtml += '</div>';
                    });
                });
                dynamichtml += '</div>';
                $(dynamichtml).appendTo($.mobile.pageContainer);
            }
        });
        //switch to Main Book Display
        $( ":mobile-pagecontainer" ).pagecontainer( "change", groupnameid, { transition: "flip" } );
        //push popup
        var hasshowntoday = false;
        if (!hasshowntoday) {
            setTimeout(function() {popupShow(groupnameid);},1000);
        }
    });

}

function generateCampaignPage(i, j, k, l) {
    //check for already existing pages and remove them
    if ($("div:jqmData(role='page')").hasClass("dynamiccampaignpage")) {
        $(".dynamiccampaignpage").remove();
    }
    //start building this page
    var dynamichtml='';
    $.getJSON( "js/feed.json", function( json ) {
        dynamichtml += '<div data-role="page" data-theme="c" id="campaignpage" class="dynamiccampaignpage"><div data-role=header data-theme=j class="ui-bar headerwithnav" data-id=myheader><div id=navleft><div id=navleft_wrapper><div id=navleft_icon><a href=#groupselect data-rel=back><i class="fa fa-chevron-left fa-2x"></i></a></div></div></div><div id="navcenter" class="centered"><div id="navcenter_wrapper"><div id="navcenter_title"><h2 class="centered">' + json.buyinggroup[i].year[j].quarter[k].event[l].title  + '</h2></div></div></div><div id=navright><div id=navright_wrapper><div id=navright_icon><a href=#chooser><i class="fa fa-bars fa-2x"></i></a></div></div></div></div><div data-role="main" class="ui-content centered"><div id="printwrap">';
        $.each(json.buyinggroup[i].year[j].quarter[k].event[l].campaign, function (m, campaign) {
             var campaignimagepath = 'images/groups/' + json.buyinggroup[i].keyid + '/' + json.buyinggroup[i].year[j].keyid + '/' + json.buyinggroup[i].year[j].quarter[k].keyid + '/' + json.buyinggroup[i].year[j].quarter[k].event[l].keyid + '/';
            if (campaign.keyid != "tv") { //build non-tv section
                var swipertemplate = "";
                if (campaign.keyid == "bs") {
                    swipertemplate = "broadsheet";
                }
                else {
                    swipertemplate = "notbroadsheet";
                }
               dynamichtml += '<div class="devicewrap centered"><div class="device"><a class="arrow-left arrow-left-' + campaign.keyid + '" href="#"></a><a class="arrow-right arrow-right-' + campaign.keyid + '" href="#"></a><div class="swiper-container swiper-thumb swiper-' + campaign.keyid + '"><div class="swiper-wrapper">';
                $.each(campaign.imageUrls, function (ii, imageURLS) {
                    dynamichtml += '<div class="swiper-slide"><a href="' + campaignimagepath +  campaign.keyid + '/' + imageURLS.fileName + imageURLS.fileExtension + '" onClick="setTimeout(function() {positionLightbox();},100);" data-ajax="false" class="swipebox" rel="' + i + l + campaign.keyid + '"><img class="thumbswiper-' + swipertemplate + '" src="' + campaignimagepath + campaign.keyid + '/thumbs_' + imageURLS.fileName + imageURLS.fileExtension +'" /></a></div>';
                });
                dynamichtml += '</div></div></div><div class="titleinfo"><h2>' + campaign.campaigntype + '</h2><p>(' + campaign.details + '\" as low as ' + campaign.pricing + ')</p></div></div>';
            }
            else { //build tv section
                dynamichtml += '</div><div class="tv">';
                if (campaign.hasOwnProperty('videoUrls')) {
                    $.each(campaign.videoUrls, function (o, videoUrls) {
                        dynamichtml += '<video width="280" poster="' + campaignimagepath + 'tv/poster.jpg" controls><source src="' + campaignimagepath + 'tv/' + videoUrls.fileName + '" type="video/' + videoUrls.fileType + '">';                            
                    });
                }
                else {
                    dynamichtml += '<video width="280" poster="images/events/thumbs_video_placeholder.jpg" controls><source src="video/placeholder.mp4" type="video/mp4">';
                }
                dynamichtml += 'Your browser does not support the video tag.</video></div><div class="titleinfo"><h2>TV</h2><P>(As low as $195.00/30:)</P></div>';
            }
        });
        dynamichtml += '</div><script type="text/javascript">$( document ).on("pageshow", "#campaignpage", function() {';
        //This section builds the swiper
        $.each(json.buyinggroup[i].year[j].quarter[k].event[l].campaign, function (m, campaign) {
            if (campaign.keyid != "tv") {
                dynamichtml += 'var swiper_' + campaign.keyid + ' = new Swiper(".swiper-' + campaign.keyid + '",{mode:"horizontal",loop: false, spaceBetween: 20, nextButton: ".arrow-right-' + campaign.keyid + '",prevButton: ".arrow-left-' + campaign.keyid + '"});';
            }
        });
        dynamichtml += '$(".swipebox").swipebox();});</script></div>';
        $(dynamichtml).appendTo($.mobile.pageContainer);
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#campaignpage", { transition: "slide" } );
    });
}

//creating a function to offset jQuery Mobile static positioning bug. Because of the bug, I've had to turn the static positioning of the swipebox to absolute.
//this function positions the lightbox appropriately. call function when the thumbnail is clicked.
function positionLightbox () {
 var windowTop = $window.scrollTop();
$("#swipebox-overlay").css("top",windowTop);
}

function popupShow(groupname) {
    windowheight = $( window ).height();
    var adcontainerheight = windowheight * .85;
    var adcontainerwidth = adcontainerheight / 1.77;
    var adOptions = { 
        closeContent: '<div class="popup_close"><button>Close</button></div>', 
        backOpacity: 0.8, 
        height: adcontainerheight, 
        width: adcontainerwidth 
    }
    var popup = new $.Popup(adOptions);
    var groupid = "#" + groupname;
    getAdInfo().done(
        function(result) {
            var theUrl = result.get("linkedUrl");
            popup.open('<div class="adcontainer"><img class="ad" src="' + result.get("adFile").url() + '" /><div class="invisiblelink" onclick="window.open(\'' + theUrl + '\',\'_blank\',\'location=yes\',\'closebuttoncaption=Return\');"</div>', 'html');
        }
    ).fail(
        function() {
            console.log('Error!');
        }
    );
}

function getAdInfo () {
    var D = $.Deferred();
    var pulledAd = Parse.Object.extend("PopupAd");
    var query = new Parse.Query(pulledAd);
    query.equalTo("belongsTo", "all");
    query.find({
        success: function(results) {
            var rand = results[Math.floor(Math.random() * results.length)];
            D.resolve(rand);
        },
        failure: function(object, error) {
            D.reject();
        }
    });
    return D.promise();
}

function vertCenter (el) {
    var windowheight = $(window).height();
    var elementheight = 370;
    var centeredheight = (windowheight - elementheight)/2;
    el.css('margin-top', centeredheight);
}

/** Reusable Functions **/
/********************************************************************/

function scaleVideoContainer() {

    var height = $(window).height();
    var unitHeight = parseInt(height) + 'px';
    $('.video-container').css('height',unitHeight);

}

function initBannerVideoSize(element){
    
    $(element).each(function(){
        $(this).data('height', $(this).height());
        $(this).data('width', $(this).width());
    });

    scaleBannerVideoSize(element);

}

function scaleBannerVideoSize(element){

    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        videoWidth,
        videoHeight;
    
    console.log(windowHeight);

    $(element).each(function(){
        var videoAspectRatio = $(this).data('height')/$(this).data('width'),
            windowAspectRatio = windowHeight/windowWidth;

        if (videoAspectRatio > windowAspectRatio ) {
            videoWidth = windowWidth;
            videoHeight = videoWidth * videoAspectRatio;
            $(this).css({'top' : -(videoHeight - windowHeight) / 2 + 'px', 'margin-left' : 0});
        } else {
            videoHeight = windowHeight;
            videoWidth = videoHeight / videoAspectRatio;
            $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});
        }

        $(this).width(videoWidth).height(videoHeight);

        $('.homepage-hero-module .video-container video').addClass('fadeIn animated');
        

    });
}
