﻿$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations();
        ManifestsModule.initializeClickEvents();
        ManifestsModule.retrieveManifestsData();
        CommonModule.retrieveHelpText('View Issue Folders');
    }
});

var ManifestsModule = (function () {

    var manifestsColl;
    var manifestElementsColl;
    var clientContext;
    var arrayOfmanifestElements;
    var arrayOfmanifests;

    var initializeClickEvents = function () {

        $('#saveIssueDescription').on('click', function () {
            var issueDescriptionText = $("#issueDescriptionText").val();
            var manifestItemId = $("#manifestItemId").val();
            var markAsIssue = $("#markAsIssue").val();
            var issueDescriptionTextPrev = $("#issueDescriptionTextPrev")[0].innerHTML;

            var dateTime = new Date();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var year = dateTime.getFullYear();
            var hours = addZero(dateTime.getHours());
            var minutes = addZero(dateTime.getMinutes());
            var seconds = addZero(dateTime.getSeconds());
            var currentDateTime = month + "/" + day + "/" + year + ", " + hours + ":" + minutes + ":" + seconds;

            var issueDescription = currentDateTime + " - " + issueDescriptionText + "<br/>" + issueDescriptionTextPrev;
            updateIssue(manifestItemId, markAsIssue, issueDescription);

            $("#saveIssueDescription").prop("disabled", true);
            $("#manifestItemDetailsInPopup").addClass("disabledbutton");
        });

        $("#manifestElementsTable").on("click", ".mark-issue", function () {
            var table = $('#manifestElementsTable').DataTable();
            var tr = $(this).parent('td').parent('tr');
            var manifestItemId = table.cell(tr, 2).nodes()[0].innerText;
            var issueDescription = table.cell(tr, 7).nodes()[0].innerHTML;
            var markAsIssue = true;

            $("#issueDescriptionText").val('');
            $("#issueDescriptionTextPrev")[0].innerHTML = issueDescription;
            $("#manifestItemId").val(manifestItemId);
            $("#markAsIssue").val(markAsIssue);

            $("#saveIssueDescription").prop("disabled", false);
            $("#manifestItemDetailsInPopup").removeClass("disabledbutton");

            highLightRow($(this).parent('td').parent('tr'));
        });

        $("#manifestElementsTable").on("click", ".cancel-issue", function () {
            var table = $('#manifestElementsTable').DataTable();
            var tr = $(this).parent('td').parent('tr');
            var manifestItemId = table.cell(tr, 2).nodes()[0].innerText;
            var issueDescription = table.cell(tr, 7).nodes()[0].innerHTML;
            var markAsIssue = false;

            $("#issueDescriptionText").val('');
            $("#issueDescriptionTextPrev")[0].innerHTML = issueDescription;
            $("#manifestItemId").val(manifestItemId);
            $("#markAsIssue").val(markAsIssue);

            $("#saveIssueDescription").prop("disabled", false);
            $("#manifestItemDetailsInPopup").removeClass("disabledbutton");

            highLightRow($(this).parent('td').parent('tr'));
        });

        $('#btnGlobalSearch').on('click', function () {

            var searchSsn = $('#globalSearch').val();

            if (searchSsn == '') {
                showAll();
            }
            else {
                var filteredmanifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement[0].indexOf(searchSsn) > -1 });

                $('#manifestElementsTable').DataTable().clear().draw();

                $('#manifestElementsTable').DataTable({
                    data: filteredmanifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN", width: "10%" },
                        { title: "Merge Status", width: "10%" },
                        { title: "Manifest Item Id", width: "10%", visible: false },
                        { title: "Manifest Id", width: "10%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "Mark as Issue", className: "text-center-align", visible: false },
                        { title: "Cancel Issue", className: "text-center-align", visible: false },
                        //{ title: "Documents" },
                        { title: "Agency Manifest", sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Box Label", sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Issue Description", sorting: false, width: "10%" },
                        { title: "Issue Status", sorting: false, width: "10%" }
                    ]
                });
            }
        });

        $('#btnClearGlobalSearch').on('click', function () {
            $('#globalSearch').val('');
            showAll();
        });

        var showAll = function () {
            retrieveManifestsData();
        }
    }

    var addZero = function (value) {
        if (value < 10) {
            value = "0" + value;
        }
        return value;
    }
    var highLightRow = function (row) {
        $('#manifestElementsTable').DataTable().$('tr.selected').removeClass('selected');
        $(row).addClass('selected');
    }

    var updateIssue = function (manifestId, issueStatus, issueDescription) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var manifestItem = manifestItemsList.getItemById(manifestId);

        manifestItem.set_item("MarkAsIssue", issueStatus);
        manifestItem.set_item("IssueDescription", issueDescription);
        manifestItem.update();
        clientContext.load(manifestItem);

        clientContext.executeQueryAsync(
            function (sender, args) {
                retrieveManifestsData();
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    var retrieveManifestsData = function () {
        console.log("Start Time: " + new Date().toLocaleString());
        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestElementsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var camlQueryManifestItems = new SP.CamlQuery();
        //camlQueryManifestItems.set_viewXml('<View Scope="Recursive"><Query><Where><Eq><FieldRef Name="MarkAsIssue"/><Value Type="Integer">1</Value></Eq></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        camlQueryManifestItems.set_viewXml('<View Scope="Recursive"><Query><Where><Or><And><Eq><FieldRef Name="MarkAsIssue"/><Value Type="Integer">1</Value></Eq><IsNotNull><FieldRef Name="MarkAsIssueDate"/></IsNotNull></And><And><Eq><FieldRef Name="MarkAsIssue"/><Value Type="Integer">0</Value></Eq><IsNotNull><FieldRef Name="ResolveIssueDate"/></IsNotNull></And></Or></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        var camlQueryManifests = new SP.CamlQuery();
        camlQueryManifests.set_viewXml('<View Scope="Recursive"><Query><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        manifestsColl = manifestsList.getItems(camlQueryManifests);
        manifestElementsColl = manifestElementsList.getItems(camlQueryManifestItems);

        clientContext.load(manifestsColl, 'Include(Title, ConversionType, Parcels, ID, ManifestID, Attachments, AttachmentFiles)');
        clientContext.load(manifestElementsColl);

        clientContext.executeQueryAsync(
            function (sender, args) {
                $("#manifestParentDiv").show();
                var manifestsListItemEnumerator = manifestsColl.getEnumerator();

                var manifests = new Array();

                while (manifestsListItemEnumerator.moveNext()) {

                    var manifestsListItem = manifestsListItemEnumerator.get_current();
                    var title = manifestsListItem.get_item('Title');
                    var conversionType = manifestsListItem.get_item('ConversionType');
                    var parcels = manifestsListItem.get_item('Parcels');
                    var parentId = manifestsListItem.get_item('ID');
                    var manifestid = manifestsListItem.get_item('ManifestID');
                    var guidId = "guid" + parentId;

                    var agencyManifestLink = '';
                    var boxLabelLink = '';

                    if (manifestsListItem.get_item('Attachments')) {
                        var attEnumerator = manifestsListItem.get_attachmentFiles().getEnumerator();
                        while (attEnumerator.moveNext()) {
                            var attachment = attEnumerator.get_current();
                            var relativeUrl = attachment.get_serverRelativeUrl();

                            if (relativeUrl.indexOf('AgencyManifest.pdf') > 0) {
                                agencyManifestLink = attachment.get_serverRelativeUrl()
                            }
                            else if (relativeUrl.indexOf('BoxLabel.pdf') > 0) {
                                boxLabelLink = attachment.get_serverRelativeUrl()
                            }
                        }
                    }

                    var manifest = [];
                    manifest.push(title);
                    manifest.push(conversionType);
                    manifest.push(parcels);
                    manifest.push(parentId);
                    manifest.push(manifestid);
                    manifest.push(agencyManifestLink);
                    manifest.push(boxLabelLink);

                    manifests.push(manifest);
                }

                arrayOfmanifests = manifests;

                var manifestElementsListItemEnumerator = manifestElementsColl.getEnumerator();

                arrayOfmanifestElements = new Array();

                while (manifestElementsListItemEnumerator.moveNext()) {
                    var manifestElementsListItem = manifestElementsListItemEnumerator.get_current();
                    var title = manifestElementsListItem.get_item('Title');
                    var mergeStatus = manifestElementsListItem.get_item('MergeStatus');
                    var id = manifestElementsListItem.get_item('ID');
                    var manifestid = manifestElementsListItem.get_item('ManifestID');
                    var issueStatus = manifestElementsListItem.get_item('MarkAsIssue');
                    var issueDescription = manifestElementsListItem.get_item('IssueDescription');
                    var guidId = "guid" + id;

                    var manifestItem = _.filter(arrayOfmanifests, function (manifestElement) { return manifestElement[4] == manifestid });

                    var agencyManifestDocumentHtml = '';
                    var boxLabelDocumentHtml = '';

                    if (manifestItem.length > 0) {
                        if (agencyManifestLink != '') {
                            agencyManifestDocumentHtml = '<a href="' + agencyManifestLink + '" target="_blank"><u>Agency Manifest</u></a>'
                        }

                        if (boxLabelLink != '') {
                            boxLabelDocumentHtml = '<a href="' + boxLabelLink + '" target="_blank"><u>Box Label</u></a>'
                        }
                    }

                    var requestPriorityHtml = '';
                    var cancelPriorityHtml = '';
                    var issueOpenOrClosed = '';

                    if (issueStatus == true) {
                        requestPriorityHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-default mark-issue" title="Mark as Issue" style="cursor:not-allowed" data-toggle="modal" data-target="#issueDescription"></span>';
                        cancelPriorityHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-info cancel-issue" title="Cancel Priority" data-toggle="modal" data-target="#issueDescription"></span>';
                        issueOpenOrClosed = "Open";
                    }
                    else {
                        requestPriorityHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-info mark-issue" title="Mark as Issue" data-toggle="modal" data-target="#issueDescription"></span>';
                        cancelPriorityHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-default cancel-issue" title="Cancel Issue" style="cursor:not-allowed" data-toggle="modal" data-target="#issueDescription"></span>';
                        issueOpenOrClosed = "Closed";
                    }

                    var manifestElement = [];
                    manifestElement.push(title);
                    manifestElement.push(mergeStatus);
                    manifestElement.push(id);
                    manifestElement.push(manifestItem[0][3]);
                    manifestElement.push(manifestid);
                    manifestElement.push(requestPriorityHtml);
                    manifestElement.push(cancelPriorityHtml);
                    //manifestElement.push(documents);
                    manifestElement.push(agencyManifestDocumentHtml);
                    manifestElement.push(boxLabelDocumentHtml);
                    manifestElement.push(issueDescription);
                    manifestElement.push(issueOpenOrClosed);
                    arrayOfmanifestElements.push(manifestElement);
                }

                $('#manifestElementsTable').DataTable({
                    data: arrayOfmanifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN", width: "10%" },
                        { title: "Merge Status", width: "10%" },
                        { title: "Manifest Item Id", width: "10%", visible: false },
                        { title: "Manifest Id", width: "10%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "Mark as Issue", className: "text-center-align", visible: false },
                        { title: "Cancel Issue", className: "text-center-align", visible: false },
                        //{ title: "Documents" },
                        { title: "Agency Manifest", sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Box Label", sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Issue Description", sorting: false, width: "10%" },
                        { title: "Issue Status", sorting: false, width: "10%" }
                    ]
                });

                console.log("End Time: " + new Date().toLocaleString());
            },
            function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }
        );
    }

    return {
        initializeClickEvents: initializeClickEvents,
        retrieveManifestsData: retrieveManifestsData
    }
})();