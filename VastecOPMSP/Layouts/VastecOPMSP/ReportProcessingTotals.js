$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations().done(function () {
            ManifestsModule.initializeClickEvents();
            ManifestsModule.getOfficeIdentifiers();
            CommonModule.retrieveHelpText('Processing Totals');
        }).fail(function () {
            console.log("Promises are not resolved properly");
        });        
    }
});

var ManifestsModule = (function () {
    var getOfficeIdentifiers = function () {
        //var servicePath = "/_layouts/15/VastecOPMSPWebService/WebService.asmx";
        //var serviceURL = "http://test.devopm.com" + servicePath;
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

            if (officeIdentifier == '' || reportStartDate == '' || reportEndDate == '') {
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
        processingTotals.OfficeIdentifier = officeIdentifier;
        processingTotals.ReportStartDate = reportStartDate;
        processingTotals.ReportEndDate = reportEndDate;

        //var servicePath = "/_layouts/15/VastecOPMSPWebService/WebService.asmx";
        //var serviceURL = "http://test.devopm.com" + servicePath;
        var serviceURL = CommonModule.getSPServiceUrl();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: serviceURL + "/GetProcessingTotalsList",
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

            if (responseObject.Result.length > 0) {
                var result = responseObject.Result[0];
                console.log(result);
                var finalResults = [];                

                if (result.hasOwnProperty('ActivitiesInScan')) {
                    var finalResult = [];
                    finalResult.push("Activities In Scan");
                    finalResult.push(result["ActivitiesInScan"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('AvgFormsPerFolder')) {
                    var finalResult = [];
                    finalResult.push("Avg Forms Per Folder");
                    finalResult.push(result["AvgFormsPerFolder"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('AvgPagesPerForm')) {
                    var finalResult = [];
                    finalResult.push("Avg Pages Per Form");
                    finalResult.push(result["AvgPagesPerForm"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('BoxesRecieved')) {
                    var finalResult = [];
                    finalResult.push("Boxes Recieved");
                    finalResult.push(result["BoxesRecieved"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('CustomerName')) {
                    var finalResult = [];
                    finalResult.push("Customer Name");
                    finalResult.push(result["CustomerName"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('FoldersCompleted')) {
                    var finalResult = [];
                    finalResult.push("Folders Completed");
                    finalResult.push(result["FoldersCompleted"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('FoldersManifested')) {
                    var finalResult = [];
                    finalResult.push("Folders Manifested");
                    finalResult.push(result["FoldersManifested"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('FoldersRecieved')) {
                    var finalResult = [];
                    finalResult.push("Folders Recieved");
                    finalResult.push(result["FoldersRecieved"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('FormsCompleted')) {
                    var finalResult = [];
                    finalResult.push("Forms Completed");
                    finalResult.push(result["FormsCompleted"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('IssueFolders')) {
                    var finalResult = [];
                    finalResult.push("Issue Folders");
                    finalResult.push(result["IssueFolders"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('OfficeIdentifier')) {
                    var finalResult = [];
                    finalResult.push("Office Identifier");
                    finalResult.push(result["OfficeIdentifier"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('PagesCompleted')) {
                    var finalResult = [];
                    finalResult.push("Pages Completed");
                    finalResult.push(result["PagesCompleted"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('PagesTransmitted')) {
                    var finalResult = [];
                    finalResult.push("Pages Transmitted");
                    finalResult.push(result["PagesTransmitted"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('PriorityFolders')) {
                    var finalResult = [];
                    finalResult.push("Priority Folders");
                    finalResult.push(result["PriorityFolders"]);

                    finalResults.push(finalResult);
                }

                if (result.hasOwnProperty('ProjectId')) {
                    var finalResult = [];
                    finalResult.push("Project Id");
                    finalResult.push(result["ProjectId"]);

                    finalResults.push(finalResult);
                }

                $('#manifestsTable').DataTable({
                    data: finalResults,
                    destroy: true,
                    pageLength: 50,
                    columns: [
                        { title: "Name", width: "50%" },
                        { title: "Value", width: "50%" }
                    ]
                });
            }            
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