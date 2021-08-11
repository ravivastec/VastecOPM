$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations();
        ManifestsModule.initializeClickEvents();
        ManifestsModule.retrieveManifestsData();
        CommonModule.retrieveHelpText('Completed Priority Requests');
    }
});

var ManifestsModule = (function () {

    var manifestElementsColl;
    var clientContext;
    var arrayOfmanifestElements;

    var initializeClickEvents = function () {

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
                        { title: "Completed Date" },
                        { title: "File Name", sorting: false, className: "text-center-align" }
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

    var retrieveManifestsData = function () {
        console.log("Start Time: " + new Date().toLocaleString());
        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);

        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestElementsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var camlQueryManifestItems = new SP.CamlQuery();
        camlQueryManifestItems.set_viewXml('<View Scope="Recursive"><Query><Where><And><Eq><FieldRef Name="RequestPriority"/><Value Type="Integer">1</Value></Eq><Eq><FieldRef Name="Completed"/><Value Type="Integer">1</Value></Eq></And></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        var camlQueryManifests = new SP.CamlQuery();
        camlQueryManifests.set_viewXml('<View Scope="Recursive"><Query><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        manifestsColl = manifestsList.getItems(camlQueryManifests);
        manifestElementsColl = manifestElementsList.getItems(camlQueryManifestItems);

        clientContext.load(manifestsColl, 'Include(Title, ConversionType, Parcels, ID, ManifestID, Attachments, AttachmentFiles)');
        clientContext.load(manifestElementsColl, 'Include(Title, MergeStatus, ID, ManifestID, RequestPriority, CompletedDate, Attachments, AttachmentFiles)');
        
        clientContext.executeQueryAsync(
            function (sender, args) {
                $("#manifestParentDiv").show();


                var manifestElementsListItemEnumerator = manifestElementsColl.getEnumerator();

                arrayOfmanifestElements = new Array();

                while (manifestElementsListItemEnumerator.moveNext()) {
                    var manifestElementsListItem = manifestElementsListItemEnumerator.get_current();
                    var title = manifestElementsListItem.get_item('Title');
                    var mergeStatus = manifestElementsListItem.get_item('MergeStatus');
                    var id = manifestElementsListItem.get_item('ID');
                    var manifestid = manifestElementsListItem.get_item('ManifestID');
                    var requestPriority = manifestElementsListItem.get_item('RequestPriority');
                    var completedDate = manifestElementsListItem.get_item('CompletedDate');

                    var completedDateVal = new Date(completedDate);
                    var month = completedDateVal.getMonth() + 1;
                    var day = completedDateVal.getDate();
                    var year = completedDateVal.getFullYear();
                    var completedDateVal2 = month + "/" + day + "/" + year;

                    var fileName = '';

                    if (manifestElementsListItem.get_item('Attachments')) {
                        var attEnumerator = manifestElementsListItem.get_attachmentFiles().getEnumerator();
                        while (attEnumerator.moveNext()) {
                            var attachment = attEnumerator.get_current();
                            var relativeUrl = attachment.get_serverRelativeUrl();

                            fileName = attachment.get_serverRelativeUrl();
                        }
                    }

                    var fileNameHtml = '';

                    if (fileName != '') {
                        fileNameHtml = '<a href="' + fileName + '" target="_blank"><u>File Name</u></a>'
                    }

                    var manifestItem = _.filter(arrayOfmanifests, function (manifestElement) { return manifestElement[4] == manifestid });

                    var manifestElement = [];
                    manifestElement.push(title);
                    manifestElement.push(mergeStatus);
                    manifestElement.push(manifestItem[0][3]);
                    manifestElement.push(id);
                    manifestElement.push(manifestid);
                    manifestElement.push(completedDateVal2);
                    manifestElement.push(fileNameHtml);
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
                        { title: "Completed Date" },
                        { title: "File Name", sorting: false, className: "text-center-align" }
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