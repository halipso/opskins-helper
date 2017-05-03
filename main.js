// ==UserScript==
// @name         OPSkins Helper
// @version      0.1
// @description  OPSkins usability is dead.
// @author       Halipso
// @match        https://opskins.com/?loc=store_account
// @match        https://opskins.com/index.php?loc=store_account
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

var toggle = 0;

$(document).ready(function(e){
    $('body').on('click', 'a.minPrice', function() {
        var input = $(this).closest('.input-group').find('input');
        var name = input.closest('tr').find('td:first a');
        name.find('.pull-right').empty();
        name = name.text();
        var StatTrak = "";
        if(name.indexOf("StatTrak™") >= 0) {
            name.replace("StatTrak™ ");
            StatTrak = "&StatTrak=1";
        }
        GM_xmlhttpRequest
        ({
            method:     "GET",
            url:        "https://opskins.com/?loc=shop_search&search_item="+name+"&sort=lh"+StatTrak,
            onload:     function(response) {input.val($(response.responseText).find('.item-amount:first').text().replace('.','').replace('$','')); }
        });
        return true;
    });

    $('body').on('click', 'button.savePrice', function() {
        var price = $(this).closest('.input-group').find('input').val();
        var id = $(this).closest('tr').find('td:first').find('a').attr('href').split('&item=')[1];
        console.log(price,id);
        if(price > 0) {
            apiRequest("POST", "ISales", "EditPrice", 1, {"saleid": id, "price": price}, function(errCode, msg, res) {
                sendAlert('<div class="alert alert-success">' + LANG.trans("shop_view_item.alert.item_adjusted") + '</div>');
            });
        }
    });
});

$(document).bind('DOMSubtreeModified',function(){
	if($('#iTrans .panel').length > 0 && !toggle) {
	 	toggle = 1;
	 	var table = $('#iTrans .panel').find('.table').eq(0);
	        table.find('thead > tr > th:first').after("<th>Edit price</td>");
	        table.find('tbody').eq(0).find('tr').each(function(key,item){
	            if($(item).hasClass('active')) {
	                $(item).find('td:first').after('<td style="width:15%;"><div class="input-group"> <input type="text" class="form-control" aria-label="Text input with segmented button dropdown">\
	                <div class="input-group-btn">\
	                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
	                <span class="caret"></span>\
	                <span class="sr-only">Toggle Dropdown</span>\
	                </button>\
	                <ul class="dropdown-menu dropdown-menu-right">\
	                <li><a class="minPrice" href="javascript:void(0)">Get min. price</a></li>\
	                </ul>\
	                <button type="button" class="savePrice btn btn-default">Save</button>\
	                </div>\
	                </div></td>');
	                var itemname = $(item).find('td:first').text();
	            } else {
	                $(item).find('td:first').after('<td style="width:15%;"></td>');
	            }
 		});
	} else if ($('#iTrans .panel').length == 0 && toggle) {
		toggle = 0;
	}
});
