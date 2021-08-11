var CommonModule = (function () {

    var _agencyName = '';
    var _spServiceUrl = '';

    var retrieveHelpText = function (screenName, helpTextType) {

        if (helpTextType == '' || typeof helpTextType == "undefined") {
            helpTextType = "Help Text";
        }

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var helpTextList = clientContext.get_web().get_lists().getByTitle('HelpText');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View Scope="Recursive"><Query><Where><And><Eq><FieldRef Name="ScreenName"/><Value Type="Text">' + screenName + '</Value></Eq><Eq><FieldRef Name="HelpTextType"/><Value Type="Text">' + helpTextType + '</Value></Eq></And></Where></Query></View>');

        var helpTextListColl = helpTextList.getItems(camlQuery);
        clientContext.load(helpTextListColl);

        clientContext.executeQueryAsync(
            function (sender, args) {
                var helpTextListItemEnumerator = helpTextListColl.getEnumerator();

                while (helpTextListItemEnumerator.moveNext()) {
                    var helpTextListItem = helpTextListItemEnumerator.get_current();
                    var helpText = helpTextListItem.get_item('HelpText');

                    var popover = $('[data-toggle="popover"]').popover({
                        html: true,
                        placement: "left",
                        container: 'body',
                        title: "Help Text!",
                        content: helpText
                    });

                    popover.on("show.bs.popover", function (e) {
                        popover.data("bs.popover").tip().css({ "max-width": "1200px" });
                    });
                }
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    var highLightRow = function (row) {
        $('#manifestsTable').DataTable().$('tr.selected').removeClass('selected');
        $(row).addClass('selected');
    }

    var validateSSNLookup = function (ssn, arrayOfSsnLookups) {
        var filtereSsnLookups = _.filter(arrayOfSsnLookups, function (arrayOfSsnLookup) { return arrayOfSsnLookup == ssn; });

        if (filtereSsnLookups.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    var retrieveConfigurations = function () {
        var deferred = $.Deferred(); 
        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var configurationList = clientContext.get_web().get_lists().getByTitle('Configurations');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View Scope="Recursive"><Query></Query></View>');

        configurationListColl = configurationList.getItems(camlQuery);
        clientContext.load(configurationListColl);

        clientContext.executeQueryAsync(
            function (sender, args) {
                var configurationListItemEnumerator = configurationListColl.getEnumerator();

                while (configurationListItemEnumerator.moveNext()) {
                    var configurationListItem = configurationListItemEnumerator.get_current();
                    var property = configurationListItem.get_item('Title');
                    var value = configurationListItem.get_item('Value');

                    if (property == 'Agency Name') {
                        _agencyName = value;
                    }

                    if (property == 'SP Service Url') {
                        _spServiceUrl = value;
                    }                    
                }

                deferred.resolve(configurationListItemEnumerator);
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
                deferred.reject(olistItem);
            }
        );
        return deferred.promise();
    }

    var getAgencyName = function () {
        return _agencyName;
    }

    var getSPServiceUrl = function () {
        return _spServiceUrl;
    }

    function changeFocus(element, evt) {

        if (element.value.replace(/[^0-9]/g, "").length == 9) {
            window.setTimeout(function () {
                if (element.parentElement.parentElement.nextSibling != null) {
                    document.getElementById(element.parentElement.parentElement.nextSibling.firstChild.firstChild.id).focus();
                }
            }, 0);
        }

        return true;
    }

    return {
        retrieveHelpText: retrieveHelpText,
        retrieveConfigurations: retrieveConfigurations,
        highLightRow: highLightRow,
        validateSSNLookup: validateSSNLookup,
        getAgencyName: getAgencyName,
        getSPServiceUrl: getSPServiceUrl,
        changeFocus: changeFocus
    }
})();