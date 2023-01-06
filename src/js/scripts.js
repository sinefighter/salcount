var $ = jQuery.noConflict();

$(document).ready(function(){

    $('.faq__item').on('click', function() {
        $(this).toggleClass('active')
        $(this).find('.answer').slideToggle(200)
    })

    // $('.tabs ul a').tabs()
    $('.tabs').each(function(){
        $(this).find('ul a').tabs()
    })


    //AJAX load posts

    const ajaxUrl = ajaxObject.ajaxUrl
     
    $(`.load-more`).each(function(){
        let currentPage = 1
        $(this).on('click', function() {
            const button = $(this).closest('.button-center')
            const perPage = parseInt($(this).data('per-page'))
            const catID = parseInt($(this).data('cat'))
            const countPosts = parseInt($(this).data('count-posts'))
            const postType = $(this).data('type')
           
            ajaxGetPosts(catID, currentPage, perPage, countPosts, postType, button)
            currentPage++

            // console.log('perPage', perPage);
            // console.log('catID', catID);
            // console.log('countPosts', countPosts);
        })

        function ajaxGetPosts(cat, currentPage, perPage, countPosts, postType, button) {
            $.ajax({
                url: ajaxUrl,
                type: 'post',
                data: {
                    action:"ajax_more_post",
                    offset: currentPage * perPage,
                    perPage: perPage,
                    cat: cat,
                    type: postType,
                },
                beforeSend: function() {
                    button.find(`.load-more span`).html('Loading..')
                },
                success: function( posts ) {
                    // console.log('perPage', perPage);
                    // console.log('currentPage', currentPage);
                    // console.log('countPosts', countPosts);

                    console.log(posts);

                    button.prev().append(posts);

                    button.find(`.load-more span`).html('Load more')

                    if((currentPage + 1) * perPage >= countPosts) {
                        button.remove()
                    }
                }
            })
        }
    })

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