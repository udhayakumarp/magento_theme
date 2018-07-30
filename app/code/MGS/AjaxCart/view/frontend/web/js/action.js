define([
    'jquery',
    'MGS_AjaxCart/js/config',
    'magnificPopup'
], function($, mgsConfig) {
    "use strict";

    jQuery.widget('mgs.action', {
        options: {
            requestParamName: mgsConfig.requestParamName
        },
        fire: function(tag, actionId, url, formData, redirectToCatalog) {
            this._fire(tag, actionId, url, formData);
        },
        _fire: function(tag, actionId, url, formData) {
            var $addToCart = '';
            if(tag.find('.tocart').length){
                $addToCart = tag.find('.tocart').text();
            }else{
                $addToCart = tag.text();
            }            
            var self = this;
            formData.append(this.options.requestParamName, 1);;;
            
            jQuery.ajax({
                url: url,
                data: formData,
                type: 'post',
                dataType: 'json',
                contentType: false,
                cache: false,
                processData:false, 
                beforeSend: function(xhr, options) {
                    if(mgsConfig.animationType){
                        jQuery('#mgs-ajax-loading').show();
                    }else{
                        if(tag.find('.tocart').length){
                            tag.find('.tocart').addClass('disabled');
                            tag.find('.tocart').text('Adding...');
                            tag.find('.tocart').attr('title','Adding...');
                        }else{
                            tag.addClass('disabled');
                            tag.text('Adding...');
                            tag.attr('title','Adding...');
                        } 
                        
                    }
                },
                success: function(response, status) {
                    if (status == 'success') {
                        if(response.backUrl){
                            formData.append('action_url', response.backUrl);
                            self._fire(tag, actionId, response.backUrl, formData);
                        }else{
                            if (response.ui) {
                                if(response.productView){
                                    jQuery('#mgs-ajax-loading').hide();
                                        if(!response.lisProduct && CATALOG_CHECK == 2){
                                            return;
                                        }
                                        jQuery.magnificPopup.open({
                                            items: {
                                                src: response.ui,
                                                type: 'iframe'
                                            },
                                            mainClass: 'success-ajax--popup',
                                            closeOnBgClick: false,
                                            preloader: true,
                                            tLoading: '',
                                            callbacks: {
                                                open: function() {
                                                    jQuery('#mgs-ajax-loading').hide();
                                                    jQuery('.mfp-preloader').css('display', 'block');
                                                },
                                                beforeClose: function() {
                                                    var url_cart_update = mgsConfig.updateCartUrl;
                                                    jQuery('[data-block="minicart"]').trigger('contentLoading');
                                                    jQuery.ajax({
                                                        url: url_cart_update,
                                                        method: "POST"
                                                    });
                                                },
                                                close: function() {
                                                    jQuery('.mfp-preloader').css('display', 'none');
                                                },
                                                afterClose: function() {
                                                    if(!response.animationType) {
                                                        var $source = '';
                                                        if(tag.find('.tocart').length){
                                                            tag.find('.tocart').removeClass('disabled');
                                                            tag.find('.tocart').text($addToCart);
                                                            tag.find('.tocart').attr('title',$addToCart);
                                                            if(tag.closest('.product-item-info').length){
                                                                $source = tag.closest('.product-item-info');
                                                                var width = $source.outerWidth();
                                                                var height = $source.outerHeight();
                                                            }else{
                                                                $source = tag.find('.tocart');
                                                                var width = 300;
                                                                var height = 300;
                                                            }
                                                            
                                                        }else{
                                                            tag.removeClass('disabled');
                                                            tag.text($addToCart);
                                                            tag.attr('title',$addToCart);
                                                            $source = tag.closest('.product-item-info');
                                                            var width = $source.outerWidth();
                                                            var height = $source.outerHeight();
                                                        }
                                                        
                                                        jQuery('html, body').animate({
                                                            'scrollTop' : jQuery(".minicart-wrapper").position().top
                                                        },2000);
                                                        var $animatedObject = jQuery('<div class="flycart-animated-add" style="position: absolute;z-index: 99999;">'+response.image+'</div>');
                                                        var left = $source.offset().left;
                                                        var top = $source.offset().top;
                                                        $animatedObject.css({top: top-1, left: left-1, width: width, height: height});
                                                        jQuery('html').append($animatedObject);
                                                        var divider = 3;
                                                        var gotoX = jQuery(".minicart-wrapper").offset().left + (jQuery(".minicart-wrapper").width() / 2) - ($animatedObject.width()/divider)/2;
                                                        var gotoY = jQuery(".minicart-wrapper").offset().top + (jQuery(".minicart-wrapper").height() / 2) - ($animatedObject.height()/divider)/2;
                                                        $animatedObject.animate({
                                                            opacity: 0.6,
                                                            left: gotoX,
                                                            top: gotoY,
                                                            width: $animatedObject.width()/2,
                                                            height: $animatedObject.height()/2
                                                        }, 2000,
                                                        function () {
                                                            jQuery(".minicart-wrapper").fadeOut('fast', function () {
                                                                jQuery(".minicart-wrapper").fadeIn('fast', function () {
                                                                    $animatedObject.fadeOut('fast', function () {
                                                                        $animatedObject.remove();
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                }else{
                                    var $content = '<div class="popup__main popup--result">'+response.ui + response.related + '</div>';
                                    if(response.animationType) {
                                        jQuery('#mgs-ajax-loading').hide();
                                        if(parent.jQuery.magnificPopup.instance.isOpen){
                                            parent.jQuery.magnificPopup.instance.items[0] = {src: $content, type: 'inline'};
                                            parent.jQuery.magnificPopup.instance.mainClass = 'success-ajax--popup';
                                            parent.jQuery.magnificPopup.instance.updateItemHTML();
                                            parent.truncateOptions();
                                            parent.replaceStrings();
                                        }else {
                                            jQuery.magnificPopup.open({
                                                mainClass: 'success-ajax--popup',
                                                items: {
                                                    src: $content,
                                                    type: 'inline'
                                                },
                                                callbacks: {
                                                    open: function() {
                                                        jQuery('#mgs-ajax-loading').hide();
                                                    },
                                                    beforeClose: function() {
                                                        var url_cart_update = mgsConfig.updateCartUrl;
                                                        jQuery('[data-block="minicart"]').trigger('contentLoading');
                                                        jQuery.ajax({
                                                            url: url_cart_update,
                                                            method: "POST"
                                                        });
                                                    }  
                                                }
                                            });
                                        }
                                    }else{
                                        var $source = '';
                                        if(tag.find('.tocart').length){
                                            tag.find('.tocart').removeClass('disabled');
                                            tag.find('.tocart').text($addToCart);
                                            tag.find('.tocart').attr('title',$addToCart);
                                            if(tag.closest('.product-item-info').length){
                                                $source = tag.closest('.product-item-info');
                                                var width = $source.outerWidth();
                                                var height = $source.outerHeight();
                                            }else{
                                                $source = tag.find('.tocart');
                                                var width = 300;
                                                var height = 300;
                                            }
                                            
                                        }else{
                                            tag.removeClass('disabled');
                                            tag.text($addToCart);
                                            tag.attr('title',$addToCart);
                                            $source = tag.closest('.product-item-info');
                                            var width = $source.outerWidth();
                                            var height = $source.outerHeight();
                                        }
                                        
                                        jQuery('html, body').animate({
                                            'scrollTop' : jQuery(".minicart-wrapper").position().top
                                        },2000);
                                        var $animatedObject = jQuery('<div class="flycart-animated-add" style="position: absolute;z-index: 99999;">'+response.image+'</div>');
                                        var left = $source.offset().left;
                                        var top = $source.offset().top;
                                        $animatedObject.css({top: top-1, left: left-1, width: width, height: height});
                                        jQuery('html').append($animatedObject);
                                        var divider = 3;
                                        var gotoX = jQuery(".minicart-wrapper").offset().left + (jQuery(".minicart-wrapper").width() / 2) - ($animatedObject.width()/divider)/2;
                                        var gotoY = jQuery(".minicart-wrapper").offset().top + (jQuery(".minicart-wrapper").height() / 2) - ($animatedObject.height()/divider)/2;                                               
                                        $animatedObject.animate({
                                            opacity: 0.6,
                                            left: gotoX,
                                            top: gotoY,
                                            width: $animatedObject.width()/2,
                                            height: $animatedObject.height()/2
                                        }, 2000,
                                        function () {
                                            jQuery(".minicart-wrapper").fadeOut('fast', function () {
                                                jQuery(".minicart-wrapper").fadeIn('fast', function () {
                                                    $animatedObject.fadeOut('fast', function () {
                                                        $animatedObject.remove();
                                                    });
                                                });
                                            });
                                        });
                                    }
                                }
                            }
                        }
                    }
                },
                error: function() {
                    jQuery('#mgs-ajax-loading').hide();
                    window.location.href = mgsConfig.redirectCartUrl;
                }
            });
        }
    });

    return jQuery.mgs.action;
});