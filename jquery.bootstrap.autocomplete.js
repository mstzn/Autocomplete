// Bootstrap + jQuery Plugin Bootstrap Autocomplete
// Bootstrap için çok amaçlı otomatik tamamlama eklentisi
// version 1.0, 13 Şubat 2014
// by Mesut UZUN

;(function($) {
    $.fn.BootstrapComplete = function(options) {
    	var cache = {}
        var defaults = {
            requestURL : '', // AJAX isteği yapılacak URL
            trigger: '@', // Otomatik tamamlama işlemini tetikleyecek karakter @ # $ gibi
            minLength : 2, // Otomatik tamamlamanın çalışması için gereken minimum girdi
            cache : true, // Otomatik tamamlama sonuçlarını önbellekleyerek performans artırımı
            method : 'POST' // AJAX isteği için metod GET | POST
        }
        var plugin = this;
        var el = $(this); // Otomatik tamamlama yapılacak elemanı bir kenara koyalım
        var term = ""; // Aranan kelimeye sürekli erişebilmek için plugin içinde global bir değişken
        plugin.settings = {}; // Boş bir ayar değişkeni oluşturuyoruz

	// Aksiyon başlasın
        var init = function() {
            // Varsayılan ayarların üzerine kullanıcının tanımladıklarını yazıyoruz
            plugin.settings = $.extend({}, defaults, options); 
            
            // Plugin içerisinde düzenli kullanım için elemanı plugin nesnesinin içerisinde tekrar tanımlıyoruz. ( Aslında çok da gerekli değil )
            plugin.el = el;

	    // Aranacak metin karakter sayısı alınırken trigger da dahil edildiği için minimum girdi uzunluğunu 1 artırıyoruz. 
            plugin.settings.minLength++;

	    // Otomatik tamamlama fonksiyonuna başlayabiliriz. ( JQuery UI - Autocomplete )
            plugin.el.autocomplete({
		        minLength: plugin.settings.minLength,
		        source: function (request, response) {
		            request.term;
		            // Eğer etkin ise Cache işlemi için aramaların sonuçlarını tuttuğumuz cache dizinden aktif sonuçları çekiyoruz.
		            if(plugin.settings.cache) {
			            if (term in cache) {
			                response(cache[ term ]);
			                return;
			            }
			        }
			        
			    // Kursor nerede imiş bir bakalım
		            var endPos = plugin.el[0].selectionEnd;
		            
		            // Kursorün bulunduğu lokasyondan geriye doğru harf harf ilerleyelim
		            for (var i = endPos; i >= 0; i--) {
		            	
		            	// Aktif karakter ch değişkeninde
		                var ch = plugin.el.val().substr(i - 1, 1);
		                
		                // Eğer aktif karakter boşluk ise otomatik tamamlamayı kapatıyoruz ve işlemi bitiriyoruz
		                // Bu şartı devre dışı bırakarak çok kelimeli tamamlamalar yapabilirsiniz
		                if(ch == " ") { plugin.el.autocomplete( "close" ); break; };
		                
		                // Eğer aktif karakter tetikleyici karakter ile aynı ise arama kelimesine 
		                // o an bulunduğumuz index ile kursor lokasyonu arasında bölümü atıyoruz.
		                if (ch == plugin.settings.trigger) {
		                    term = plugin.el.val().substr(i - 1, endPos - i + 1);
		                    break;
		                }
		            }
		            
		            // Eğer arama kelimesi bizim istediğimiz minimum uzunlukta yada fazla ise ve
		            // İstenen tetikleyici ile başlıyorsan AJAX işlemini başlatabiliriz.
		            if ($.trim(term).length >= plugin.settings.minLength && term.substr(0, 1) == plugin.settings.trigger) {
		                var request = $.ajax({
						  type: plugin.settings.method,
						  url: plugin.settings.requestURL,
						  data: { 'term': term },
						  dataType : 'json'
						});
						request.done(function(data){
							
							// Cache özelliği aktif ise cache dizisine dahil ediyoruz.
							if(plugin.settings.cache) {
								cache[term] = data;
							}
							// response JQuery UI için kaynaktan cevap geldiğinde çalıştırmamız gereken fonksiyon
							// Otomatik tamamlana işlemleri bu fonksiyonun çağırılması ile başlar
		                    			response(data);
						});
						request.fail(function(jqXHR, textStatus){
							// AJAX isteği başarısız ise burada bir şeyler olacak
							console.log('Fail! Desc:' + textStatus);
						});
		            }
		        },
		        focus: function (event, ui) {
		            // Herhangi bir sonuç satırına gelindiğinde JQuery UI içerisinde yapılan varsayılan işlemi engelliyoruz
		            return false;
		        },
		        select: function (event, ui) {
		            
		            // Sonuç listesinden bir sonuç seçildiğinde verileri işleme işlemine başlıyoruz
		            
		            // Kursörün bulunduğu nokta yine elimizde
		            var endPos = plugin.el[0].selectionEnd;
		            
		            // Geriye doğru bir döngü daha, bakalım neler varmış kursörün öncesinde
		            for (var i = endPos; i >= 0; i--) {
		            	
		            	// Aktif karakter de elimizde
		                var ch = plugin.el.val().substr(i - 1, 1);
		                
		                // Aktif karakter boşluk ise daha fazla geriye gitmeye gerek yok, kelimemizi bulduk.
		                // Bu şartı devre dışı bırakarak çok kelimeli tamamlamalar yapabilirsiniz
		                if(ch == " ") { plugin.el.autocomplete( "close" ); break; };
		                
		                // Eğer aktif karakter tetikleyici karakter ise elemanın içerisindeki veriyi olması gereken tamamlama verisi ile değiştirelim
		                if (ch == plugin.settings.trigger) {
		               	    // Elemanın içerisinde aktif karaktere kara olan bölüm + tamamlama verisi + kursörün bulunduğu noktadan sonrası
		                    plugin.el.val(plugin.el.val().slice(0, i) + ui.item.value + " " + plugin.el.val().slice(endPos));
		                    
		                    // İşimiz bitti, döngünün devam etmesine gerek yok
		                    break;
		                }
		            }
		            
		            // Yapılan değişiklik sonrası kursörü ekrar yerine getirebilmek için aradaki karakter farkını bulalım
		            var valDiff =  ui.item.value.length - term.length + 2;
		            
		            // Elemanda kursoru olması gerek yere konumlandıralım
		            plugin.selectPos(plugin.el[0], endPos + valDiff, endPos + valDiff);

		            return false;
		        }
		    }).data("ui-autocomplete")._renderItem = function (ul, item) {
		    	// Otomatik tamamlama esnasında gelecek listede bazı düzenlemeler gerekebilir.
		    	// İstediğiniz şekilde değiştirebilirsiniz 
		    	// silmeniz durumunda JQuery UI varsayılanı geçerli olacaktır
		        return $("<li>")
		            .append("<a><img src='" + item.image + "' class='img-thumbnail' style='height:20px; width:20px; margin-right:5px;' />" + item.label + "</a>")
		            .appendTo(ul);
		    };
        }
        
        // Kursör konumlandırma (plugin-private) fonksiyonu
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

