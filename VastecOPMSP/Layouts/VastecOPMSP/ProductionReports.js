$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations().done(function () {
            ManifestsModule.initializeClickEvents();
            ManifestsModule.getOfficeIdentifiers();
            CommonModule.retrieveHelpText('Production Report');
        }).fail(function () {
            console.log("Promises are not resolved properly");
        });
    }
});

var ManifestsModule = (function () {
    var getOfficeIdentifiers = function () {

        var serviceURL = CommonModule.getSPServiceUrl();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: serviceURL + "/GetPOIDs",
            data: "{agencyName:" + JSON.stringify(CommonModule.getAgencyName()) + "}",
            dataType: "json",
            success: processResult,
            error: failure,
            crossDomain: true
        });

        //Handle result
        function processResult(xData) {
            var responseObject = jQuery.parseJSON(xData.d);
            console.log(responseObject.Result);

            $('#officeIdentifier option').each(function () {
                $(this).remove();
            });

            $("#officeIdentifier").append("<option value=''>All Office Identifiers</option>");

            for (var poidIndex = 0; poidIndex < responseObject.Result.length; poidIndex++) {
                var poid = responseObject.Result[poidIndex];

                var officeIdentifier = poid.OfficeIdentifier;
                var streetAddress = poid.StreetAddress;
                var projectOfficeIdentifierId = poid.ProjectOfficeIdentifierId;

                $("#officeIdentifier").append("<option value='" + officeIdentifier + "'>" + officeIdentifier + " - " + streetAddress + "</option>");
            }

            $("#manifestParentDiv").show();
        }

        //Handle Failure
        function failure(all, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    }

    var initializeClickEvents = function () {
        $('#btnSearch').on('click', function () {

            var officeIdentifier = $("#officeIdentifier option:checked").val();
            var reportStartDate = $("#reportStartDate").val();
            var reportEndDate = $("#reportEndDate").val();

            if (reportStartDate == '' || reportEndDate == '') {
                alert("Please select all search fields!")
            }
            else {
                retrieveManifestsData(officeIdentifier, reportStartDate, reportEndDate);
            }
        });
    }

    var retrieveManifestsData = function (officeIdentifier, reportStartDate, reportEndDate) {
        var processingTotals = {};
        processingTotals.CustomerId = null;
        processingTotals.AgencyName = CommonModule.getAgencyName();
        processingTotals.OfficeIdentifier = officeIdentifier == '' ? null : officeIdentifier;
        processingTotals.ReportStartDate = reportStartDate;
        processingTotals.ReportEndDate = reportEndDate;

        //var servicePath = "/_layouts/15/VastecOPMSPWebService/WebService.asmx";
        //var serviceURL = "http://test.devopm.com" + servicePath;
        var serviceURL = CommonModule.getSPServiceUrl();

        if (serviceURL == '') {
            serviceURL = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/VastecOPMSPWebService/WebService.asmx";
        }

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: serviceURL + "/GetProductionReports",
            data: "{processingTotals:" + JSON.stringify(processingTotals) + "}",
            dataType: "json",
            success: processResult,
            error: failure,
            crossDomain: true
        });

        //Handle result
        function processResult(xData) {
            var responseObject = jQuery.parseJSON(xData.d);
            console.log(responseObject.Result);

            if (responseObject.Result != null) {
                if (responseObject.Result.length > 0) {
                    var finalResults = [];

                    for (var index = 0; index < responseObject.Result.length; index++) {
                        var result = responseObject.Result[index];

                        var finalResult = [];

                        if (result.hasOwnProperty('OfficeIdentifier')) {
                            finalResult.push(result["OfficeIdentifier"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        if (result.hasOwnProperty('FoldersManifested')) {
                            finalResult.push(result["FoldersManifested"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        if (result.hasOwnProperty('FoldersReceived')) {
                            finalResult.push(result["FoldersReceived"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        if (result.hasOwnProperty('ActivitiesInScan')) {
                            finalResult.push(result["ActivitiesInScan"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        if (result.hasOwnProperty('FoldersCompleted')) {
                            finalResult.push(result["FoldersCompleted"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        if (result.hasOwnProperty('FormsCompleted')) {
                            finalResult.push(result["FormsCompleted"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        if (result.hasOwnProperty('PagesCompleted')) {
                            finalResult.push(result["PagesCompleted"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        if (result.hasOwnProperty('AvgPagesPerForm')) {
                            finalResult.push(result["AvgPagesPerForm"]);
                        }
                        else {
                            finalResult.push("");
                        }

                        finalResults.push(finalResult);
                    }
                }
            }

            $('#manifestsTable').DataTable({
                data: finalResults,
                destroy: true,
                pageLength: 50,
                columns: [
                    { title: "Office Identifier" },
                    { title: "OPFs Manifested" },
                    { title: "OPFs Received" },
                    { title: "OPFs Scanned" },
                    { title: "OPFs Completed" },
                    { title: "Documents Completed" },
                    { title: "Images Completed" },
                    { title: "Average Images Per Folder" }
                ]
            });
        }

        //Handle Failure
        function failure(all, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    }

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    return {
        initializeClickEvents: initializeClickEvents,
        getOfficeIdentifiers: getOfficeIdentifiers,
        retrieveManifestsData: retrieveManifestsData
    }
})();