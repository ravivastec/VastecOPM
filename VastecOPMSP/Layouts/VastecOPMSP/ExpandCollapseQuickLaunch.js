// Find all the top level links in the Quick Launch that have children
var topLevelLinks = $("div[id$='QuickLaunchMenu'] > ul > li:has('ul') > a");

// Prepend the little "twiddle" icon to each top level link
topLevelLinks.prepend("<span class='ms-commentexpand-iconouter ql-icon'><img alt='expand' src='/Comm/Comms2/_themes/1/spcommon-B35BB0A9.themedpng?ctag=2' class='ms-commentexpand-icon'></span>");

// We're starting with all of the sections collapsed. If you want them expanded, comment this out.
topLevelLinks.closest("li").find("> ul").hide();

// Set up for the click even of on the top level links
topLevelLinks.click(function (e) {

    // We're going to stop the default behavior
    e.preventDefault();

    // Find the elements we need to work with
    var childUl = $(this).closest("li").find("> ul");
    var isVisible = childUl.is(":visible")

    // If the section is visible, hide it, and vice versa
    if (isVisible) {

        // Replace the icon with its antitheses
        $(this).find(".ql-icon").replaceWith("<span class='ms-commentexpand-iconouter ql-icon'><img alt='Expand' src='/Comm/Comms2/_themes/1/spcommon-B35BB0A9.themedpng?ctag=2' class='ms-commentexpand-icon'></span>");
        // Hide the child links by sliding up. Note: You could change the effect here.
        childUl.slideUp();

    } else {

        // Replace the icon with its antitheses
        $(this).find(".ql-icon").replaceWith("<span class='ms-commentcollapse-iconouter ql-icon'><img alt='Collapse' src='/Comm/Comms2/_themes/1/spcommon-B35BB0A9.themedpng?ctag=2' class='ms-commentcollapse-icon'></span>");
        // Show the child links by sliding down. Note: You could change the effect here.
        childUl.slideDown();

    }

});