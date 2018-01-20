$(document).ready(function(e){

    var myOptions = {
        deals: [],
        from: "",
        to: "",
        filterType: "cheap",
        bestDeal: {},
        currency: ""
    }
    // Global vars to store from / to locations in the data set
    var fromAr = {};
    var toAr = {};

    // Function to load the initial data from the data set
    function loadData(){
        $.ajax({
            // URL Should be in a constants class...
            url:'./data/response.json',
            dataType: 'json',
            type: 'get',
            success:function(data){
                myOptions.deals = data.deals;
                myOptions.currency = data.currency;
                loadSelectors(data);
                initializeSelectors();
            },
            error: function(data){
                // Do something if error happens by retreiving the info...
            }
        });
    }

    // Load the selectors with the given locations in the data set, stored in global from/to vars.
    function loadSelectors(data){
        $.each(data.deals, function (k, deal) {
            fromAr[deal.departure] = deal.departure;
            toAr[deal.arrival]= deal.arrival;
        });
        $.each(fromAr, function(k,v){
            $('#from__selector').append("<option value='" + v + "'>" + v +  "</option>");
        });
        $.each(toAr, function (k, v) {
            $('#to__selector').append("<option value='" + v + "'>" + v + "</option>");
        });
    }

    // 1st -> load from & to possibilities:
    loadData();

    // 2st -> Set up selectors configuration:
    function initializeSelectors(){
        $('#from__selector').awselect({
            background: "transparent", //the dark blue background
            active_background: "none", // the light blue background
            placeholder_color: "#f8f8f8", // the light blue placeholder color
            placeholder_active_color: "#f2c649", // the dark blue placeholder color
            option_color: "#f8f8f8", // the option colors
            vertical_padding: "3px", //top and bottom padding
            horizontal_padding: "0", // left and right padding,
            immersive: true
        });
        $('#to__selector').awselect({
            background: "transparent", //the dark blue background
            active_background: "none", // the light blue background
            placeholder_color: "#f8f8f8", // the light blue placeholder color
            placeholder_active_color: "#f2c649", // the dark blue placeholder color
            option_color: "#f8f8f8", // the option colors
            vertical_padding: "3px", //top and bottom padding
            horizontal_padding: "0", // left and right padding,
            immersive: true
        }); 
    }
    

    // Switch event: Cheap/fast switch click event

    $('.Switcher__element').on('click', function(e){
        var elem = $(this).attr('id');
        myOptions.filterType = elem;

        $('.Switcher__list li').removeClass('selected');
        $('#'+elem).addClass('selected');
    });

    // On selectors change, manage the results to store them:
    $('select').on('change', function(e){
        // Getting values from selectors
        myOptions.from = $('#from__selector').val();
        myOptions.to = $('#to__selector').val();
        // If both values are equal, do not allow the search
        // & display warnings...
        if(myOptions.from == myOptions.to){
            $('#search').attr("disabled", "disabled");
            $('.awselect').addClass('warning');
        } else {
            $('#search').removeAttr("disabled");
            $('.awselect').removeClass('warning');
        }
    });

    // Search action:
    $('#search').on('click', function(e) {
        if (myOptions.from != "" && myOptions.to != "") {
            switch (myOptions.filterType) {
                case "cheap":
                    myOptions.bestDeal = getCheapestDeal(myOptions.deals, myOptions.from, myOptions.to);
                break;
                case "fast":
                    myOptions.bestDeal = getFastestDeal(myOptions.deals, myOptions.from, myOptions.to);
                break;
            }
            renderResults();
        }
    });

    // Reset action:
    $('#reset').on('click', function(e){
        myOptions = {
            deals: myOptions.deals,
            from: "",
            to: "",
            filterType: "cheap",
            bestDeal: {},
            currency: myOptions.currency
        }

        // Upgrading filters:
        $('select').val("");

        // Clean results
        $('#deal-list').html("");
        $('#deal-info').html("");
        $('#deal-totals').html("");
        $('.current_value').html("");

    });

    function renderResults(){
        var domTitle = "";
        var domCards = "";
        var domTotals = "";
        // Build title of section
        domTitle += "<span class='location'>"+ myOptions.from.toUpperCase();
        domTitle += "</h3> <i class='fa fa-chevron-right'></i><span class='location'>";
        domTitle += myOptions.to.toUpperCase() +"</span><hr></hr>";
        // Build cards by given deals:
        $.each(myOptions.bestDeal[0], function(k,v){
            domCards += "<li class='apparition'><div class='Card__wrapper'><div class='Cardinfo col-md-4'><label class='Card__label--upper'>From:</label>";
            domCards += "<span class='Card__title--big'>" + v.departure.toUpperCase() + "</span></div><div class='Cardinfo col-md-4 transportation'><div>";
            domCards += "<label>Duration: </label> <span>" + v.timeFormat + "</span>";
            domCards += "<span class='grandBar'></span><i class='fa fa-" + v.transportType + "'></i>";
            domCards += "</div></div><div class='Cardinfo col-md-4'><label class='Card__label--upper'>To:</label>";
            domCards += "<span class='Card__title--big'>" + v.arrival.toUpperCase() + "</span>"
            domCards += "</div></div><div class='buttonMore'><span onclick='hideLayer(event);'>";
            domCards += "<i id='" + v.reference.toUpperCase() + "' class='fa fa-chevron-down'></i></span></div></li>";
            domCards += "<li id='ID_" + v.reference.toUpperCase() + "' class='Card__details hidden'><div class='hiddenCardInfo__wrapper'><div class='hiddenCardInfo__content'>";
            domCards += "<div class='extraInfos leftInfo col-md-6 col-sm-6 col-xs-12'><label>Ref: </label><span>" + v.reference + "</span>";
            domCards += "</div><div class='extraInfos rightInfo col-md-6 col-sm-6 col-xs-12'><label>Cost: </label><span class='cost'>" + v.cost + " " + myOptions.currency + "</span>"
            domCards += "</div></div></div></li>";
        });

        var totalDuration = myOptions.bestDeal[1];
        // Parse total Duration to HH h MM min format:
        var totalHours = parseInt(totalDuration/60);
        if (totalHours < 10){
            totalHours = "0"+totalHours;
        }
        var totalMins = parseInt(totalDuration % 60);
        if (totalMins < 10 ){
            totalMins = "0"+totalMins;
        }
        var totalCost = myOptions.bestDeal[2];
        // Build title of section

        domTotals += "<hr class='totalDivider apparition'></hr>";
        domTotals += "<div class='TripList__results apparition col-md-6 col-sm-6 col-xs-12'><div class='totals'>";
        domTotals += "<label>Total Duration: </label> <span>" + totalHours + "h " + totalMins + "min</span></div><div class='totals'>";
        domTotals += "<label>Total Cost: </label> <span>" + totalCost + " " + myOptions.currency + "</span> </div> </div>";

        // Clean results
        $('#deal-list').html("");
        $('#deal-info').html("");
        $('#deal-totals').html("");

        // Load new ones:
        $('#deal-info').html(domTitle);
        $('#deal-list').append(domCards);
        $('#deal-totals').append(domTotals);

        // Quick scroll to results:
        $('html, body').animate({
            scrollTop: $("#deal-info").offset().top
        }, 2000);
    }

});

function fromChange(value) {
    $('#from__selector').val(value);
}
function toChange(value) {
    $('#to__selector').val(value);
}

// Layer hide/show effect:
function hideLayer(element){
    var item = element.target.id;
    console.log(element);
    $('#ID_'+item).toggleClass('hidden');
}
// Layer hide/show effect:
function hideShowLayer(e) {
    e.stopPropagation();
    var item = e.target.id;
    $('#ID_' + item).toggleClass('hidden');
}