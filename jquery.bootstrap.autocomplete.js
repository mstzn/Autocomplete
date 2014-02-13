// Bootstrap + jQuery Plugin Bootstrap Autocomplete
// Bootstrap için çok amaçlı otomatik tamamlama eklentisi
// version 1.0, 13 Şubat 2014
// by Mesut UZUN

;(function($) {
    $.fn.BootstrapComplete = function(options) {
    	var cache = {}
        var defaults = {
        	requestURL : '',
            trigger: '@',
            minLength : 2,
            cache : true,
            method : 'POST'
        }
        var plugin = this;
        var el = $(this);
        var term = "";
        plugin.settings = {}

        var init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.el = el;

            plugin.settings.minLength++;

            plugin.el.autocomplete({
		        minLength: plugin.settings.minLength,
		        source: function (request, response) {
		            request.term;
		            if(plugin.settings.cache) {
			            if (term in cache) {
			                response(cache[ term ]);
			                return;
			            }
			        }

		            var endPos = plugin.el[0].selectionEnd;
		            for (var i = endPos; i >= 0; i--) {
		                var ch = plugin.el.val().substr(i - 1, 1);
		                if(ch == " ") { plugin.el.autocomplete( "close" ); break; };
		                if (ch == plugin.settings.trigger) {
		                    term = plugin.el.val().substr(i - 1, endPos - i + 1);
		                    break;
		                }
		            }

		            if ($.trim(term).length >= plugin.settings.minLength && term.substr(0, 1) == plugin.settings.trigger) {
		                var request = $.ajax({
						  type: plugin.settings.method,
						  url: plugin.settings.requestURL,
						  data: { 'term': term },
						  dataType : 'json'
						});
						request.done(function(data){
							if(plugin.settings.cache) {
								cache[term] = data;
							}
		                    response(data);
						});
						request.fail(function(jqXHR, textStatus){
							console.log('Fail! Desc:' + textStatus);
						});
		            }
		        },
		        focus: function (event, ui) {
		            return false;
		        },
		        select: function (event, ui) {
		            var endPos = plugin.el[0].selectionEnd;
		            for (var i = endPos; i >= 0; i--) {
		                var ch = plugin.el.val().substr(i - 1, 1);
		                if(ch == " ") { plugin.el.autocomplete( "close" ); break; };
		                if (ch == plugin.settings.trigger) {
		                    plugin.el.val(plugin.el.val().slice(0, i) + ui.item.value + " " + plugin.el.val().slice(endPos));
		                    break;
		                }
		            }

		            var valDiff =  ui.item.value.length - term.length + 2;

		            plugin.selectPos(plugin.el[0], endPos + valDiff, endPos + valDiff);

		            return false;
		        }
		    }).data("ui-autocomplete")._renderItem = function (ul, item) {
		        return $("<li>")
		            .append("<a><img src='" + item.image + "' class='img-thumbnail' style='height:20px; width:20px; margin-right:5px;' />" + item.label + "</a>")
		            .appendTo(ul);
		    };
        }

        plugin.selectPos = function(e, start, end){
		     e.focus();
		     if(e.setSelectionRange)
		        e.setSelectionRange(start, end);
		     else if(e.createTextRange) {
		        e = e.createTextRange();
		        e.collapse(true);
		        e.moveEnd('', end);
		        e.moveStart('', start);
		        e.select();
		     }
		}
        init();

    }

})(jQuery);

