$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations();
        ManifestsModule.initializeClickEvents();
        ManifestsModule.retrieveManifestsData();
        CommonModule.retrieveHelpText('View Priority Requests');
    }
});

var ManifestsModule = (function () {

    var manifestElementsColl;
    var clientContext;
    var arrayOfmanifestElements;
    var arrayOfmanifests;

    var initializeClickEvents = function () {

        $("#manifestElementsTable").on("click", ".request-priority", function () {

            var table = $('#manifestElementsTable').DataTable();
            var tr = $(this).parent('td').parent('tr');
            var manifestItemId = table.cell(tr, 2).nodes()[0].innerText;

            //table.cell($(this).parent('td').parent('tr'), 4).nodes()[0].innerHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-default request-priority" title="Request Priority" style="cursor:not-allowed"></span>';
            //table.cell($(this).parent('td').parent('tr'), 5).nodes()[0].innerHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-info cancel-priority" title="Cancel Priority"></span>';

            //table.cell(tr, 4).data('<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-default request-priority" title="Request Priority" style="cursor:not-allowed"></span>').draw();
            //table.cell(tr, 5).data('<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-info cancel-priority" title="Cancel Priority"></span>').draw();

            updatePriority(manifestItemId, true);

        });

        $("#manifestElementsTable").on("click", ".cancel-priority", function () {

            var table = $('#manifestElementsTable').DataTable();
            var tr = $(this).parent('td').parent('tr');
            var manifestItemId = table.cell(tr, 2).nodes()[0].innerText;

            //table.cell($(this).parent('td').parent('tr'), 4).nodes()[0].innerHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-info request-priority" title="Request Priority"></span>';
            //table.cell($(this).parent('td').parent('tr'), 5).nodes()[0].innerHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-default cancel-priority" title="Cancel Priority" style="cursor:not-allowed"></span>';

            // table.cell(tr, 4).data('<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-info request-priority" title="Request Priority"></span>').draw();
            //table.cell(tr, 5).data('<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-default cancel-priority" title="Cancel Priority" style="cursor:not-allowed"></span>').draw();

            updatePriority(manifestItemId, false);

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
                        { title: "SSN" },
                        { title: "Merge Status", visible: false },
                        { title: "Manifest Id" },
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "Request Priority", className: "text-center-align", visible: false },
                        { title: "Cancel Priority", className: "text-center-align", visible: false },
                        { title: "Request Priority Date", className: "text-center-align" }
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

    var updatePriority = function (manifestId, priorityStatus) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        //var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var manifestItem = manifestItemsList.getItemById(manifestId);

        manifestItem.set_item("RequestPriority", priorityStatus);
        manifestItem.update();
        clientContext.load(manifestItem);
        clientContext.executeQueryAsync(
            function (sender, args) {
                retrieveManifestsData();
            },
            function (sender, args) {
                //alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
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
        camlQueryManifestItems.set_viewXml('<View Scope="Recursive"><Query><Where><Eq><FieldRef Name="RequestPriority"/><Value Type="Integer">1</Value></Eq></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

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
                    var requestPriority = manifestElementsListItem.get_item('RequestPriority');
                    var requestPriorityDate = manifestElementsListItem.get_item('RequestPriorityDate');

                    var requestPriorityDateVal = new Date(requestPriorityDate);
                    var month = requestPriorityDateVal.getMonth() + 1;
                    var day = requestPriorityDateVal.getDate();
                    var year = requestPriorityDateVal.getFullYear();
                    var requestPriorityDateVal2 = month + "/" + day + "/" + year ;
                    //var hours = addZero(requestPriorityDateVal.getHours());
                    //var minutes = addZero(requestPriorityDateVal.getMinutes());
                    //var seconds = addZero(requestPriorityDateVal.getSeconds());
                    //var currentDateTime = month + "/" + day + "/" + year + ", " + hours + ":" + minutes + ":" + seconds;

                    var guidId = "guid" + id;

                    var requestPriorityHtml = ''
                    var cancelPriorityHtml = ''

                    if (requestPriority == true) {
                        requestPriorityHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-default request-priority" title="Request Priority" style="cursor:not-allowed"></span>';
                        cancelPriorityHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-info cancel-priority" title="Cancel Priority"></span>';
                    }
                    else {
                        requestPriorityHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-info request-priority" title="Request Priority"></span>';
                        cancelPriorityHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-default cancel-priority" title="Cancel Priority" style="cursor:not-allowed"></span>';
                    }

                    var manifestItem = _.filter(arrayOfmanifests, function (manifestElement) { return manifestElement[4] == manifestid });

                    var manifestElement = [];
                    manifestElement.push(title);
                    manifestElement.push(mergeStatus);
                    manifestElement.push(manifestItem[0][3]);
                    manifestElement.push(id);
                    manifestElement.push(manifestid);
                    manifestElement.push(requestPriorityHtml);
                    manifestElement.push(cancelPriorityHtml);
                    manifestElement.push(requestPriorityDateVal2);
                    arrayOfmanifestElements.push(manifestElement);
                }

                $('#manifestElementsTable').DataTable({
                    data: arrayOfmanifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN" },
                        { title: "Merge Status", visible: false },
                        { title: "Manifest Id" },
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "Request Priority", className: "text-center-align", visible: false },
                        { title: "Cancel Priority", className: "text-center-align", visible: false },
                        { title: "Request Priority Date", className: "text-center-align" }
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