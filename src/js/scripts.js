$(document).ready(function(){

	$("input[name=phone]").inputmask("+38 (999) 999-9999")
	
	$(document).on('click', '.scroll-link', function(event){
		event.preventDefault();
		
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
	})
	$(document).on('click', '.navigation a', function(event){
		event.preventDefault();
		
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
	})
	
	
	$('form .btn').click(function(e){
		e.preventDefault();
		
		var a = $(this).closest('form');
        var x = true;
		
        a.find('input').removeClass('error');
		
        a.find('input').each(function() {
            if ($(this).attr('required') !== undefined && $(this).val() === '') {
                $(this).addClass('error');
                $(this).focus();
                x = false;
                return false;
            }
        });
        if (x) {
            a.find('input[type=text]').removeClass('error');
            a.submit();
        }
        return false;
		
	})
	
	$(document).on('click', '.btn', function(){
		var remodal = $(this).data('remodal-target'),
		dataFrom = $(this).data('from');
		if(remodal){	
			$('#'+remodal).find('input[name=from]').val(dataFrom);
		}
	})

    $('.toggle-menu').on('click', function (){
		toggleMenu();
	})

    function toggleMenu(){
        $('.toggle-menu').toggleClass('open');
        $('.mobile-menu').toggleClass('open');
        $('body').toggleClass('no-scroll');
        $('.mobile-bg').fadeToggle(200);
    }

    new WOW().init();

	$('a[href="#"]').click(function(e){ e.preventDefault(); });

});

$.fn.tabs = function() {
	var selector = this;
	this.each(function() {
		var obj = $(this); 
		
		$(obj.attr('href')).hide();
		obj.click(function() {
			$(selector).removeClass('selected');
			
			$(this).addClass('selected');
			
			$($(this).attr('href')).fadeIn();
			$(selector).not(this).each(function(i, element) {
				$($(element).attr('href')).hide();
			});
			return false;
			
		});
	});
	$(this).show();
	$(this).first().click();
};

function isWebp() {
    function testWebP(callback) {

        var webP = new Image();
        webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
        
    testWebP(function (support) {
        
        if (support == true) {
        document.querySelector('html').classList.add('webp');
        }else{
        document.querySelector('html').classList.add('no-webp');
        }
    });
}

isWebp()