$(document).ready(function(e){

    var myOptions = {
        deals: [],
        from: "",
        to: "",
        filterType: "cheap",
    }


    function loadData(){
        $.ajax({
            // URL Should be in a constants class...
            url:'./data/response.json',
            dataType: 'json',
            type: 'get',
            success:function(data){
                myOptions.deals = data.deals;
                loadSelectors(data);
                initializeSelectors();
            },
            error: function(data){
                // Do something if error happens by retreiving the info...
            }
        });
    }

    function loadSelectors(data){
        var fromAr = {};
        var toAr = {};
        $.each(data.deals, function (k, deal) {
            fromAr[deal.departure] = deal.departure;
            toAr[deal.arrival]= deal.arrival;
        });
        console.log(fromAr);
        console.log(toAr);
        $.each(fromAr, function(k,v){
            $('#from__selector').append("<option value='" + v + "'>" + v +  "</option>");
        });
        $.each(toAr, function (k, v) {
            $('#to__selector').append("<option value='" + v + "'>" + v + "</option>");
        })
    }

    // 1st -> load from & to possibilities:
    loadData();

    // 2st -> Set up selectors configuration:
    function initializeSelectors(){
        $('#from__selector').awselect({
            background: "none", //the dark blue background
            active_background: "none", // the light blue background
            placeholder_color: "#f8f8f8", // the light blue placeholder color
            placeholder_active_color: "#f2c649", // the dark blue placeholder color
            option_color: "#f8f8f8", // the option colors
            vertical_padding: "3px", //top and bottom padding
            horizontal_padding: "0", // left and right padding,
            immersive: true
        });
        $('#to__selector').awselect({
            background: "none", //the dark blue background
            active_background: "none", // the light blue background
            placeholder_color: "#f8f8f8", // the light blue placeholder color
            placeholder_active_color: "#f2c649", // the dark blue placeholder color
            option_color: "#f8f8f8", // the option colors
            vertical_padding: "3px", //top and bottom padding
            horizontal_padding: "0", // left and right padding,
            immersive: true
        }); 
    }
    

    // Switch event:

    $('.Switcher__element').on('click', function(e){
        var elem = $(this).attr('id');
        myOptions.filterType = elem;

        $('.Switcher__list li').removeClass('selected');
        $('#'+elem).addClass('selected');
        console.log(myOptions);
    });

    $('select').on('change', function(e){
        console.log("values changed for destinations");
        myOptions.from = $('#from__selector').val();
        myOptions.to = $('#to__selector').val();
        console.log(myOptions);
    });

    $('#search').on('click', function(e){
        console.log(getCheapestDeal(myOptions.deals, myOptions.from, myOptions.to));
    })

});

function fromChange(value){
    $('#from__selector').val(value);
}
function toChange(value){
    $('#to__selector').val(value);
}