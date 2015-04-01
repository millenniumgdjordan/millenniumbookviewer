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

function buildPanel () {
    var li="";
    //container for $li to be added
    li += '<div class="centered chooserhead"><h4>Events</h4></div><li><a href="#millenniumhome">Home</a></li>';
    $.each(feed.event, function (i, eventID) {
        //get data from feed and add to li variable
        li += '<li><a href="#' + eventID.id + '">' + eventID.title+ '</a></li>';
    });
    li += '<li><a href="#credits">Credits</a></li>';
    //append list to the ul
    $("#panellist").append(li);
    $( "body>[data-role='panel']" ).panel().enhanceWithin();
};

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
        $("#login_wrapper").animate({left: '-=10px'}, 100);
        var i;
        for (i = 0; i < 3; i++) {
            $("#login_wrapper").animate({left: '+=20px'}, 100);
            $("#login_wrapper").animate({left: '-=20px'}, 100);
        }
        $("#login_wrapper").animate({left: '+=10px'}, 100);
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
                var dynamichtml =  '<div data-role="page" id="' + buyinggroup.keyid + '"> <div data-role="header" class="headerwithnav ui-bar"  data-id="myheader" data-tap-toggle="false"><div id="navleft"><a href="#" data-rel="back" ><div id="navleft_wrapper"> <div id="navleft_icon"><img src="images/header_backarrow.svg" width=7 height=14 /></div> <div id="navleft_title"><h4>Back</h4></div></div></a></div><div id="navcenter" class="centered"> <div id="navcenter_wrapper"> <div id="navcenter_title"> <h2 class="centered">' + buyinggroup.realname + '</h2> </div> </div> </div> <div id="navright"> <div id="navright_wrapper"> <div id="navright_icon"> <a href="#chooser"><img src="images/header_hamburger.svg" width=28 height=14 /></a> </div> </div> </div> </div> <div data-role="main" class="ui-content centered">';
                $.each(buyinggroup.year, function (j, eventyear) {
                    dynamichtml += '<h2>' + eventyear.keyid + '</h2>';
                    dynamichtml += '<div id="quarterwrapper" data-role="tabs"> <div id="quarternav" data-role="navbar"> <ul> <li><a href="#q1" data-theme="b" data-ajax="false" class="ui-btn-active">Q1</a></li> <li><a href="#q2" data-theme="b" data-ajax="false">Q2</a></li> <li><a href="#q3" data-theme="b" data-ajax="false">Q3</a></li> <li><a href="#q4" data-theme="b" data-ajax="false">Q4</a></li> </ul> </div>';
                    $.each(eventyear.quarter, function (k, quarter) {
                        dynamichtml += '<div id="' + quarter.keyid + '" class="ui-content" >';
                        $.each(quarter.event, function (l, eventview) {
                            dynamichtml += '<div class="onethird"><a href="#" onclick="generateCampaignPage(' + i + ',' + j + ',' + k + ',' + l + ')"><img class="eventicon" src="images/groups/' + buyinggroup.keyid + '/' + eventyear.keyid + '/' + quarter.keyid + '/' + eventview.keyid + '/eventicon300px@2x.png" /></a><div class="onethirdcaption"><p>' + eventview.title + '</p></div></div>';
                        });
                        dynamichtml += '</div>';
                    });
                });
                dynamichtml += '</div>';
                $(dynamichtml).appendTo($.mobile.pageContainer);
            }
        });
        //switch to Main Book Display
        $( ":mobile-pagecontainer" ).pagecontainer( "change", groupnameid, { transition: "flip" } );
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
        dynamichtml += '<div data-role="page" id="campaignpage" class="dynamiccampaignpage"><div data-role="header" class="headerwithnav ui-bar" data-id="myheader" data-tap-toggle="false"><div id="navleft"><a href="#" data-rel="back" ><div id="navleft_wrapper"><div id="navleft_icon"><img src="images/header_backarrow.svg" width=7 height=14 /></div><div id="navleft_title"><h4>Back</h2></div></div></a></div><div id="navcenter" class="centered"><div id="navcenter_wrapper"><div id="navcenter_title"><h2 class="centered">' + json.buyinggroup[i].year[j].quarter[k].event[l].title  + '</h2></div></div></div><div id="navright"><div id="navright_wrapper"><div id="navright_icon"><a href="#chooser"><img src="images/header_hamburger.svg" width=28 height=14 /></a></div></div></div></div><div data-role="main" class="ui-content centered"><div id="printwrap">';
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
                    dynamichtml += '<div class="swiper-slide"><a href="' + campaignimagepath +  campaign.keyid + '/' + imageURLS.fileName + imageURLS.fileExtension + '" data-ajax="false" class="swipebox" rel="' + i + l + campaign.keyid + '"><img class="thumbswiper-' + swipertemplate + '" src="' + campaignimagepath + campaign.keyid + '/thumbs_' + imageURLS.fileName + imageURLS.fileExtension +'" /></a></div>';
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

