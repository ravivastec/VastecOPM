$(function () {
    var menuClickedOld = readCookie("Menu_Clicked");
    var cookieArray = null;
    if (menuClickedOld != null) {
        cookieArray = menuClickedOld.split('#');
    }
    if ($('#sideNavBox .menu-item.selected').length) {
        $('li.static').removeClass('selected');
        $('#sideNavBox .menu-item.selected').parents('li.static').addClass('selected');
        $('#sideNavBox .root.static > li.static').each(function () {
            if ($('span > span > span ', this).html() == undefined) {
                if (jQuery.inArray($('a > span > span ', this).html(), cookieArray) == -1) {
                    if ($(this).find('ul').length > 0) {
                        $(this).find('ul').hide();
                        $(this).addClass('collapsed');
                    }
                }
            }
            else {
                if (jQuery.inArray($('span > span > span ', this).html(), cookieArray) == -1) {
                    if ($(this).find('ul').length > 0) {
                        $(this).find('ul').hide();
                        $(this).addClass('collapsed');
                    }
                }
            }
        });
    }
    else $('#sideNavBox .root.static > li.static > ul').hide();
    $('#sideNavBox .root.static > li.static').each(function () {
        if ($(this).find('ul').length) {
            $(this).addClass('father');
            $(this).css("position", "relative");

            var prependText = "<span class='left-header-collapse'></span>";

            if ($(this).hasClass('collapsed')) {
                prependText = "<span class='left-header-expand'></span>";
            }

            $(this).prepend(prependText).click(function (event) {
                if (event.target.className == 'left-header-collapse' || event.target.className == 'left-header-expand') {
                    if ($(this).children('ul').css('display') != 'none') {
                        $(this).removeClass('selected').children('ul').slideUp();
                        //$(this).find('span[class*="leftHeader"]').css('background-image', 'url("/_layouts/15/images/expand.gif")');
                        $(this).find('span[class*="left-header-collapse"]').css('background', 'url("/_layouts/15/images/expand.gif") no-repeat');
                        $(this).find('span[class*="left-header-collapse"]').removeClass('left-header-collapse').addClass('left-header-expand');
                        if ($('span > span > span ', this).html() == undefined) {
                            var menuClicked = RemoveCookie("Menu_Clicked", $('a > span > span ', this).html(), 1);
                        }
                        else {
                            var menuClicked = RemoveCookie("Menu_Clicked", $('span > span > span ', this).html(), 1);
                        }
                    }
                    else {
                        //$(this).find('span[class*="leftHeader"]').css('background-image', 'url("/_layouts/15/images/collapse.gif")');
                        $(this).find('span[class*="left-header-expand"]').css('background', 'url("/_layouts/15/images/collapse.gif") no-repeat');
                        $(this).find('span[class*="left-header-expand"]').removeClass('left-header-expand').addClass('left-header-collapse');
                        if ($('span > span > span ', this).html() == undefined) {
                            var menuClicked = createCookie("Menu_Clicked", $('a > span > span ', this).html(), 1);
                        }
                        else {
                            var menuClicked = createCookie("Menu_Clicked", $('span > span > span ', this).html(), 1);
                        }
                        $(this).addClass('selected').children('ul').slideDown();
                        //$(this).find('span[class*="leftHeader"]').css('background-image', 'url("/_layouts/15/images/expand.gif")');
                    }
                }
            });
        }
    });
});

function createCookie(name, value, days) {
    var nameEQ = name + "=";
    var cookievalue;
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) cookievalue = c.substring(nameEQ.length, c.length);
    }
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    if (cookievalue != null) {
        var cookieArray = cookievalue.split('#');
        if (jQuery.inArray(value, cookieArray) != -1) {
            value = cookievalue + '#';
        }
        else {
            value = value + '#' + cookievalue;
        }
    }
    else {
        value = value + '#';
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function RemoveCookie(name, value, days) {
    var nameEQ = name + "=";
    var cookievalue;
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) cookievalue = c.substring(nameEQ.length, c.length);
    }
    if (cookievalue != null) {
        var cookieArray = cookievalue.split('#');
        if (jQuery.inArray(value, cookieArray) != -1) {
            value = value + '#';
            cookievalue = cookievalue.replace(value, '');
        }
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else var expires = "";
        document.cookie = name + "=" + cookievalue + expires + "; path=/";
    }
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    createCookie(name, "", -1);
}