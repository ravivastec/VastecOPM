$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations();
        ManifestsModule.initializeClickEvents();
        ManifestsModule.retrieveManifestsData();
        CommonModule.retrieveHelpText('Manage Priority Requests');
    }
});

var ManifestsModule = (function () {

    var manifestsColl;
    var manifestElementsColl;
    var clientContext;
    var arrayOfmanifestElements;
    var arrayOfmanifests;
    var currentUserName;
    var ssnLookupColl;
    var arrayOfSsnLookups;

    var initializeClickEvents = function () {
        $('#cancelPriorityRequest').on('click', function () {

            var manifestItemId = $("#manifestItemId").val();
            updatePriority(manifestItemId, false);

            $("#cancelPriorityRequest").prop("disabled", true);

        });

        $("#manifestElementsTableNew").on("click", ".manifest-items-table-delete", function () {

            var table = $('#manifestElementsTableNew').DataTable();

            globalCounter--;

            //var manifestItemId = table.cell($(this).parent('td').parent('tr'), 2).nodes().to$().find('input').val();
            var manifestItemId = table.cell($(this).parent('td').parent('tr'), 2).nodes()[0].innerText;
            table.row($(this).parent('td').parent('tr')).remove().draw(false);

            if (manifestItemId != '') {
                deleteManifestItemData(manifestItemId);
            }
        });

        $("#manifestElementsTable").on("click", ".cancel-priority", function () {

            var table = $('#manifestElementsTable').DataTable();
            var tr = $(this).parent('td').parent('tr');
            var manifestItemId = table.cell(tr, 3).nodes()[0].innerText;

            $("#manifestItemId").val(manifestItemId);
            
            $("#cancelPriorityRequest").prop("disabled", false);

        });

        /*Start Initialize New/Edit Html*/

        var globalCounter = 1;

        $('#addNewManifestElement').on('click', function () {

            var t = $('#manifestElementsTableNew').DataTable();
            var rowtitle = "manifest-element-title-" + globalCounter;
            var rowmergestatus = "manifest-element-mergestatus-" + globalCounter;
            var rowspid = "manifest-element-spid-" + globalCounter;

            t.row.add([
                '<input type="text" id="' + rowtitle + '" name="' + rowtitle + '" onkeypress="javascript:return ManifestsModule.isSSN(this, event)" maxlength="11"/>',
                //'<input type="checkbox" id="' + rowmergestatus + '" name="' + rowmergestatus + '">',
                '<select id="' + rowmergestatus + '" name="' + rowmergestatus + '"><option value="Yes">Yes</option><option value="No">No</option></select>',
                //'<input type="text" id="' + rowspid + '" name="' + rowspid + '"/>',
                '',
                '<span class="manifest-items-table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>',
                ''
            ]).draw(false);

            globalCounter++;
        });

        $("#createNewManifestButton").on('click', function () {
            $("#newParcel").val('');
            $("#newConversionType").val($("#newConversionType option:first").val());
            $("#newAgency").val($("#newAgency option:first").val());
            $("#manifestDocumentSpan").empty();
            $("#spId").val('');
            $("#manifestId").val('');
            //var newTable = $('#manifestElementsTableNew').DataTable({
            //    destroy: true,
            //    paging: false,
            //    searching: false
            //});

            var newTable = $('#manifestElementsTableNew').DataTable({
                "columnDefs": [
                    {
                        "targets": [0],
                        "width": "50%"
                    },
                    {
                        "targets": [1],
                        "width": "30%"
                    },
                    {
                        "targets": [2],
                        "width": "20%"
                    },
                    {
                        "targets": [2],
                        "visible": false
                    },
                    {
                        "targets": [4],
                        "visible": false
                    }
                ],
                destroy: true
            });

            newTable.clear().draw();

            //$("#popupTitle").text('New Manifest');
            $("#saveNewManifest").prop("disabled", false);
            $("#addNewManifestElement").prop("disabled", false);
            $("#manifestElementsTableNew").parent('div').removeClass("disabledbutton");
            $("#manifestDetailsInPopup").removeClass("disabledbutton");
        });
        //$('#addNewManifestElement').click();

        $('#saveNewManifest').on('click', function () {
            var newAgency = $("#newAgency option:checked").val();
            var newConversionType = $("#newConversionType option:checked").val();
            var newParcel = $("#newParcel").val();
            var spId = $("#spId").val();
            var manifestId = $("#manifestId").val();

            var newManifest = [];
            newManifest.push(spId);
            newManifest.push(newAgency);
            newManifest.push(newConversionType);
            newManifest.push(newParcel);
            newManifest.push(manifestId);

            if (newParcel == '') {
                alert("Parcels field is required! Please enter Parcels!");
                return false;
            }

            //var data = $('#manifestElementsTableNew').DataTable().rows().data();
            //var newManifestItems = [];

            //for (var cellIndex = 0; cellIndex < data.length; cellIndex = cellIndex + 4) {
            ////data.each(function (value, index) {
            //    if (data[cellIndex].value == '') {
            //        alert("SSN field is required, please enter valid SSN!");
            //        return false;
            //    }
            //    else if (validateSSN(data[cellIndex].value) == false) {
            //        alert("SSN " + data[cellIndex].value + " is invalid, please enter valid SSN!");
            //        return false;
            //    }
            //    else {
            //        if (validateSSNLookup(data[cellIndex].value.replace(/-/g, '')) == false) {
            //            alert("SSN " + data[cellIndex].value + " not found, please enter valid SSN!");
            //            return false;
            //        }
            //    }

            //    var newManifestItem = [];
            //    newManifestItem.push(data[cellIndex].value.replace(/-/g, ''));
            //    newManifestItem.push(data[cellIndex + 1].checked);
            //    newManifestItem.push(data[cellIndex + 2].value);
            //    newManifestItems.push(newManifestItem);
            //}

            var data = $('#manifestElementsTableNew').DataTable().$('input, input:checked, select');
            var newManifestItems = [];
            var rowIndex = 0;
            for (var cellIndex = 0; cellIndex < data.length; cellIndex = cellIndex + 2) {

                if (data[cellIndex].value == '') {
                    alert("SSN field is required, please enter valid SSN!");
                    return false;
                }
                else if (validateSSN(data[cellIndex].value) == false) {
                    alert("SSN " + data[cellIndex].value + " is invalid, please enter valid SSN!");
                    return false;
                }
                //else {
                //    if (validateSSNLookup(data[cellIndex].value.replace(/-/g, '')) == false) {
                //        alert("SSN " + data[cellIndex].value + " not found, please enter valid SSN!");
                //        return false;
                //    }
                //}

                var newManifestItem = [];
                newManifestItem.push(data[cellIndex].value.replace(/-/g, ''));
                newManifestItem.push(data[cellIndex + 1].value);
                //newManifestItem.push(data[cellIndex + 2].value);
                newManifestItem.push($('#manifestElementsTableNew').DataTable().rows().data()[rowIndex][2]);
                newManifestItems.push(newManifestItem);

                rowIndex = rowIndex + 1;
            }

            $("#saveNewManifest").prop("disabled", true);
            $("#addNewManifestElement").prop("disabled", true);
            $("#manifestElementsTableNew").parent('div').addClass("disabledbutton");
            $("#manifestDetailsInPopup").addClass("disabledbutton");

            if (spId == '') {
                saveNewManifestData(newManifest, newManifestItems);
            }
            else {
                saveEditManifestData(newManifest, newManifestItems)
            }

        });

        function validateSSN(elementValue) {
            var ssnPattern = /^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/;
            return ssnPattern.test(elementValue);
        }

        $("#manifestsTable_disabled").on("click", ".table-edit", function () {
            var newTable = $('#manifestElementsTableNew').DataTable({
                "columnDefs": [
                    {
                        "targets": [2],
                        "visible": false
                    },
                    {
                        "targets": [4],
                        "visible": false
                    }
                ],
                destroy: true
            });
            newTable.clear().draw();

            var table = $('#manifestsTable').DataTable();
            var title = table.row($(this).parent('td').parent('tr')).data()[0];
            var conversionType = table.row($(this).parent('td').parent('tr')).data()[1];
            var parcels = table.row($(this).parent('td').parent('tr')).data()[2];
            var spId = table.row($(this).parent('td').parent('tr')).data()[3];
            var manifestId = table.row($(this).parent('td').parent('tr')).data()[4];
            var links = table.row($(this).parent('td').parent('tr')).data()[8];

            $("#newAgency").val(title);
            $("#newConversionType").val(conversionType);
            $("#newParcel").val(parcels);
            $("#spId").val(spId);
            $("#manifestId").val(manifestId);
            $("#manifestDocumentSpan").empty();
            $("#manifestDocumentSpan").append(links);

            var guidLookup = table.row($(this).parent('td').parent('tr')).data()[4];
            if (guidLookup != '') {
                var filteredmanifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.manifestid == guidLookup; });

                for (index = 0; index < filteredmanifestElements.length; index++) {
                    //$('#addNewManifestElement').click();

                    var localCounter = index + 1;
                    var rowtitle = "manifest-element-title-" + localCounter;
                    var rowmergestatus = "manifest-element-mergestatus-" + localCounter;
                    var rowspid = "manifest-element-spid-" + localCounter;

                    newTable.row.add([
                        '<input type="text" id="' + rowtitle + '" name="' + rowtitle + '" value="' + filteredmanifestElements[index].title + '" onkeypress="javascript:return ManifestsModule.isSSN(this, event)" maxlength="11"/>',
                        //'<input type="checkbox" id="' + rowmergestatus + '" name="' + rowmergestatus + '">',
                        '<select id="' + rowmergestatus + '" name="' + rowmergestatus + '"><option value="Yes">Yes</option><option value="No">No</option></select>',
                        //'<input type="text" id="' + rowspid + '" name="' + rowspid + '" value="' + filteredmanifestElements[index].id + '" />',
                        filteredmanifestElements[index].id,
                        '<span class="manifest-items-table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>',
                        filteredmanifestElements[index].title
                    ]).draw(false);

                    //$("#" + rowtitle).val(filteredmanifestElements[index].title);
                    //$("#" + rowmergestatus).prop('checked', filteredmanifestElements[index].mergeStatus);
                    $("#" + rowmergestatus).val(filteredmanifestElements[index].mergeStatus);
                    //$("#" + rowspid).val(filteredmanifestElements[index].id);
                }
            }

            //$("#popupTitle").text('Edit Manifest');
            $("#saveNewManifest").prop("disabled", false);
            $("#addNewManifestElement").prop("disabled", false);
            $("#manifestElementsTableNew").parent('div').removeClass("disabledbutton");
            $("#manifestDetailsInPopup").removeClass("disabledbutton");

            highLightRow($(this).parent('td').parent('tr'));
        });

        //$("#manifestsTable").on("click", ".table-delete", function () {

        //    var table = $('#manifestsTable').DataTable();

        //    //$(this).parent('td').parent('tr').detach();
        //    var manifestId = table.row($(this).parent('td').parent('tr')).data()[3];
        //    var guidLookup = table.row($(this).parent('td').parent('tr')).data()[4];

        //    if (guidLookup != '') {
        //        var filteredmanifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.manifestid == guidLookup; });

        //        var manifestItemsIds = new Array();

        //        for (index = 0; index < filteredmanifestElements.length; index++) {
        //            manifestItemsIds.push(filteredmanifestElements[index].id);
        //        }
        //    }

        //    deleteManifestsData(manifestId, manifestItemsIds);
        //});

        $("#manifestsTable").on("click", ".table-select", function () {
            var table = $('#manifestsTable').DataTable();

            var guidLookup = $(this).parent('td').parent('tr').find("td:nth-child(4)")[0].innerText;
            guidLookup = table.row($(this).parent('td').parent('tr')).data()[4];
            var parentId = table.row($(this).parent('td').parent('tr')).data()[3];

            if (guidLookup != '') {
                var filteredmanifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.manifestid == guidLookup; });
                console.log(filteredmanifestElements);

                var manifestElements = new Array();

                for (index = 0; index < filteredmanifestElements.length; index++) {

                    var manifestElement = [];
                    manifestElement.push(filteredmanifestElements[index].title);
                    manifestElement.push(filteredmanifestElements[index].mergeStatus);
                    manifestElement.push(parentId);
                    manifestElement.push(filteredmanifestElements[index].id);
                    manifestElement.push(filteredmanifestElements[index].manifestid);
                    //manifestElement.push(filteredmanifestElements[index].requestPriority);
                    manifestElement.push(filteredmanifestElements[index].cancelPriority)
                    manifestElements.push(manifestElement);
                }

                $('#manifestElementsTable').DataTable({
                    data: manifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN" },
                        { title: "Merge Status", visible: false },
                        { title: "Manifest Id" },
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "Cancel Priority", className: "text-center-align" }
                        //{ title: "Cancel Priority", className: "text-center-align" }
                    ]
                });
            }
            else {
                var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                $(this).parents('tr').find("td.guid-id")[0].innerText = guid;
            }

            highLightRow($(this).parent('td').parent('tr'));
        });

        //function filterGlobal() {
        //    $('table.globalSearch tr:not("[class*=selected]"').DataTable().search($('#globalSearch').val()).draw();
        //}

        //$('#globalSearch').on('keyup click', function () {
        //    filterGlobal();
        //});


        $.fn.dataTableExt.ofnSearch['html-input'] = function (value) {
            return $(value).val();
        };

        var table = $("#manifestElementsTableNew").DataTable({
            columnDefs: [
                { "type": "html-input", "targets": [0, 1] }
            ]
        });

        $('#btnGlobalSearch').on('click', function () {

            var searchSsn = $('#globalSearch').val();

            if (searchSsn == '') {
                showAll();
            }
            else {
                var filteredmanifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.title.indexOf(searchSsn) > -1 });
                //var filteredManifests = _.each(filteredmanifestElements, function (filteredmanifestElement) {
                //    _.filter(arrayOfmanifests, function (manifestElement) { return manifestElement.manifestId == filteredmanifestElement.manifestId; });
                //});

                var filteredManifests = _.filter(arrayOfmanifests, function (manifestElement) {
                    return _.find(filteredmanifestElements, function (filteredmanifestElement) { return manifestElement[4] == filteredmanifestElement.manifestid; });
                });

                $('#manifestsTable').DataTable({
                    data: filteredManifests,
                    destroy: true,
                    columns: [
                        { title: "Agency", width: "10%" },
                        { title: "Conversion Type", width: "10%" },
                        { title: "Parcels (Boxes)", width: "10%", visible: false },
                        { title: "Manifest Id", width: "10%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "View", sorting: false, width: "10%", className: "text-center-align" }
                        //{ title: "Edit", sorting: false, width: "10%", className: "text-center-align" },
                        //{ title: "Delete", sorting: false, width: "10%", className: "text-center-align" },
                        //{ title: "Documents", sorting: false, width: "20%" }
                    ]
                });

                $('#manifestElementsTable').DataTable().clear().draw();
            }
        });

        $('#btnClearGlobalSearch').on('click', function () {
            $('#globalSearch').val('');
            showAll();

        });

        var showAll = function () {
            //$('#manifestsTable').DataTable({
            //    data: arrayOfmanifests,
            //    destroy: true,
            //    columns: [
            //        { title: "Agency", width: "10%" },
            //        { title: "Conversion Type", width: "10%" },
            //        { title: "Parcels (Boxes)", width: "10%", visible: false },
            //        { title: "Manifest Id", width: "10%" },
            //        { title: "Manifest Id Lookup", visible: false },
            //        { title: "View", sorting: false, width: "10%", className: "text-center-align" }
            //        //{ title: "Edit", sorting: false, width: "10%", className: "text-center-align" },
            //        //{ title: "Delete", sorting: false, width: "10%", className: "text-center-align" },
            //        //{ title: "Documents", sorting: false, width: "20%" }
            //    ]
            //});

            //$('#manifestElementsTable').DataTable().clear().draw();

            retrieveManifestsData();
        }
    }

    var highLightRow = function (row) {
        $('#manifestsTable').DataTable().$('tr.selected').removeClass('selected');
        $(row).addClass('selected');
    }

    var validateSSNLookup = function (ssn) {
        var filtereSsnLookups = _.filter(arrayOfSsnLookups, function (arrayOfSsnLookup) { return arrayOfSsnLookup == ssn; });

        if (filtereSsnLookups.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    var retrieveManifestsData = function () {
        console.log("Start Time: " + new Date().toLocaleString());
        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestElementsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');
        var ssnLookupList = clientContext.get_web().get_lists().getByTitle('SSNLookup');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View Scope="Recursive"><Query><Where></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        var camlQuery2 = new SP.CamlQuery();
        camlQuery2.set_viewXml('<View Scope="Recursive"><Query><Where><Eq><FieldRef Name="RequestPriority"/><Value Type="Integer">1</Value></Eq></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        manifestsColl = manifestsList.getItems(camlQuery);
        manifestElementsColl = manifestElementsList.getItems(camlQuery2);

        ssnLookupColl = ssnLookupList.getItems(camlQuery);

        clientContext.load(manifestsColl, 'Include(Title, ConversionType, Parcels, ID, ManifestID, Attachments, AttachmentFiles)');
        clientContext.load(manifestElementsColl);
        clientContext.load(ssnLookupColl);

        var currentUser = clientContext.get_web().get_currentUser(); //must load this to access info.
        clientContext.load(currentUser);

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
                    var id = manifestsListItem.get_item('ID');
                    var manifestid = manifestsListItem.get_item('ManifestID');
                    var guidId = "guid" + id;

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
                    manifest.push(id);
                    manifest.push(manifestid);
                    manifest.push('<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-info" title="Select"></span>');
                    //manifest.push('<button type="button" class="table-edit btn btn-info" data-toggle="modal" data-target="#createNewManifest"><span class="glyphicon glyphicon-edit cursor-pointer" title="Edit"></span></button>');
                    //manifest.push('<span class="table-edit glyphicon glyphicon-edit cursor-pointer btn btn-info" data-toggle="modal" data-target="#createNewManifest" title="Edit"></span>');
                    //manifest.push('<span class="table-edit glyphicon glyphicon-edit cursor-pointer btn btn-default" style="cursor:not-allowed"></span>');
                    //manifest.push('<span class="table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>');

                    //linkHtml = '';

                    //if (agencyManifestLink != '') {
                    //    linkHtml += '<a href="' + agencyManifestLink + '" target="_blank"><u>Agency Manifest</u></a>'
                    //}

                    //if (boxLabelLink != '') {
                    //    linkHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + boxLabelLink + '" target="_blank"><u>BOX LABEL</u></a>'
                    //}
                    //manifest.push(linkHtml);

                    manifests.push(manifest);
                }

                arrayOfmanifests = manifests;

                var manifestElementsListItemEnumerator = manifestElementsColl.getEnumerator();

                arrayOfmanifestElements = new Array();

                //$('#manifestsTable').DataTable({
                //    data: manifests,
                //    destroy: true,
                //    columns: [
                //        { title: "Agency", width: "10%" },
                //        { title: "Conversion Type", width: "10%" },
                //        { title: "Parcels (Boxes)", width: "10%", visible: false },
                //        { title: "Manifest Id", width: "10%" },
                //        { title: "Manifest Id Lookup", visible: false },
                //        { title: "View", sorting: false, width: "10%", className: "text-center-align" }
                //        //{ title: "Edit", sorting: false, width: "10%", className: "text-center-align" },
                //        //{ title: "Delete", sorting: false, width: "10%", className: "text-center-align" },
                //        //{ title: "Documents", sorting: false, width: "20%" }
                //    ]
                //});

                $('#manifestElementsTable').DataTable({
                    data: arrayOfmanifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN" },
                        { title: "Merge Status", visible: false },
                        { title: "Manifest Id" },
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "Cancel Priority", className: "text-center-align" }
                        //{ title: "Cancel Priority", className: "text-center-align" }
                    ]
                });

                while (manifestElementsListItemEnumerator.moveNext()) {
                    var manifestElementsListItem = manifestElementsListItemEnumerator.get_current();
                    var title = manifestElementsListItem.get_item('Title');
                    var mergeStatus = manifestElementsListItem.get_item('MergeStatus');
                    var id = manifestElementsListItem.get_item('ID');
                    var manifestid = manifestElementsListItem.get_item('ManifestID');
                    var requestPriority = manifestElementsListItem.get_item('RequestPriority');
                    var guidId = "guid" + id;

                    var requestPriorityHtml = ''
                    var cancelPriorityHtml = ''

                    if (requestPriority == true) {
                        //requestPriorityHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-default request-priority" title="Request Priority" style="cursor:not-allowed"></span>';
                        cancelPriorityHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-info cancel-priority" title="Cancel Priority" data-toggle="modal" data-target="#cancelPriority"></span>';
                    }
                    else {
                        //requestPriorityHtml = '<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-info request-priority" title="Request Priority" data-toggle="modal" data-target="#requestPriority"></span>';
                        cancelPriorityHtml = '<span class="table-select glyphicon glyphicon-remove cursor-pointer btn btn-default cancel-priority" title="Cancel Priority" style="cursor:not-allowed" data-toggle="modal" data-target="#cancelPriority"></span>';
                    }

                    var manifestElement = {
                        title: title,
                        mergeStatus: mergeStatus,
                        id: id,
                        manifestid: manifestid,
                        cancelPriority: cancelPriorityHtml
                    }

                    arrayOfmanifestElements.push(manifestElement);
                }


                var filteredManifests = _.filter(arrayOfmanifests, function (manifestElement) {
                    return _.find(arrayOfmanifestElements, function (filteredmanifestElement) { return manifestElement[4] == filteredmanifestElement.manifestid; });
                });

                $('#manifestsTable').DataTable({
                    data: filteredManifests,
                    destroy: true,
                    columns: [
                        { title: "Agency", width: "10%" },
                        { title: "Conversion Type", width: "10%" },
                        { title: "Parcels (Boxes)", width: "10%", visible: false },
                        { title: "Manifest Id", width: "10%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "View", sorting: false, width: "10%", className: "text-center-align" }
                        //{ title: "Edit", sorting: false, width: "10%", className: "text-center-align" },
                        //{ title: "Delete", sorting: false, width: "10%", className: "text-center-align" },
                        //{ title: "Documents", sorting: false, width: "20%" }
                    ]
                });

                currentUserName = currentUser.get_title()

                var ssnLookupListItemEnumerator = ssnLookupColl.getEnumerator();
                arrayOfSsnLookups = new Array();

                while (ssnLookupListItemEnumerator.moveNext()) {
                    var ssnLookupListItem = ssnLookupListItemEnumerator.get_current();
                    var ssn = ssnLookupListItem.get_item('Title');

                    arrayOfSsnLookups.push(ssn.replace(/-/g, ''));
                }

                console.log("End Time: " + new Date().toLocaleString());
            },
            function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }
        );
    }

    var manifestListItem;
    //var manifestAttachmentBuffer;
    //var boxLabelDocumentBuffer;
    //var jsPdfObj;

    var saveNewManifestData = function (manifestData, manifestItemsData) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');
        var guidToBeUsed = '';

        if (manifestData[0] == '') {

            var itemCreateInfo = new SP.ListItemCreationInformation();
            manifestListItem = manifestsList.addItem(itemCreateInfo);

            var newGuid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();;
            manifestListItem.set_item('Title', manifestData[1]);
            manifestListItem.set_item('ConversionType', manifestData[2]);
            manifestListItem.set_item('Parcels', manifestData[3]);
            manifestListItem.set_item('ManifestID', newGuid);

            manifestListItem.update();

            clientContext.load(manifestListItem);

            //jsPdfObj = [];
            //jsPdfObj.push(manifestData[1]);
            //jsPdfObj.push(manifestData[2]);
            //jsPdfObj.push(manifestData[3]);
            //jsPdfObj.push(newGuid);

            for (var manifestItemIndex = 0; manifestItemIndex < manifestItemsData.length; manifestItemIndex++) {
                var manifestItem = manifestItemsData[manifestItemIndex];
                var newSsn = manifestItem[0];
                var newMergeStatus = manifestItem[1];

                var manifestItemCreateInfo = new SP.ListItemCreationInformation();
                var manifestItemListItem = manifestItemsList.addItem(manifestItemCreateInfo);
                manifestItemListItem.set_item('Title', newSsn);
                manifestItemListItem.set_item('MergeStatus', newMergeStatus);
                manifestItemListItem.set_item('ManifestID', newGuid);

                manifestItemListItem.update();

                clientContext.load(manifestItemListItem);

                //jsPdfItemObj = [];
                //jsPdfItemObj.push(newSsn);
                //jsPdfItemObj.push(newMergeStatus);
                //jsPdfObj.push(jsPdfItemObj);
            }
        }

        clientContext.executeQueryAsync(
            function (sender, args) {
                retrieveManifestsData();
                //var newManifestId = manifestListItem.get_id();

                //var doc = new jsPDF();
                //doc.setFont("helvetica");
                //doc.setFontSize(28);
                //doc.text(25, 30, 'Agency Manifest');

                //doc.setFontSize(16);
                //doc.text(25, 40, 'Agency: ' + jsPdfObj[0]);
                //doc.text(25, 50, 'Conversion Type: ' + jsPdfObj[1]);
                //doc.text(25, 60, 'Box/Manifest ID: ' + newManifestId);
                //doc.text(25, 70, 'Number of Parcels: ' + jsPdfObj[2]);

                //var columns = [
                //    { title: "SSN", dataKey: "ssn" },
                //    { title: "Batch ID", dataKey: "batchid" },
                //    { title: "Merge Status", dataKey: "mergestatus" },
                //    { title: "Date/Time Added", dataKey: "datetime" },
                //    { title: "Manifest User", dataKey: "createduser" }
                //];

                //var rows = []


                //if (jsPdfObj.length > 4) {
                //    for (index = 4; index < jsPdfObj.length; index++) {
                //        var row = {};
                //        row['ssn'] = jsPdfObj[index][0];
                //        row['batchid'] = newManifestId;
                //        row['mergestatus'] = jsPdfObj[index][1];
                //        row['datetime'] = new Date().toLocaleString();
                //        row['createduser'] = currentUserName;
                //        rows.push(row);
                //    }
                //}

                //doc.autoTable(columns, rows, {
                //    headerStyles: { fillColor: [0, 51, 102] },
                //    margin: { top: 100, left: 25, right: 25 },
                //    styles: { fontSize: 11, font: "helvetica" },
                //    theme: 'grid'
                //});

                //doc.setFont("helvetica");
                //doc.setFontSize(11);
                //doc.text(25, 255, "Agency Signature: ___________________________________Date: ____________________");
                //doc.text(25, 270, "Scanning Facility Signature: ___________________________Date: ____________________");

                //manifestAttachmentBuffer = doc.output('arraybuffer');

                //var boxLabelDoc = new jsPDF();
                //boxLabelDoc.setFont("helvetica");
                //boxLabelDoc.setFontSize(28);
                //boxLabelDoc.text(25, 30, 'BOX LABEL');


                //var boxLabelColumns = [
                //   { title: "Hidden Column", dataKey: "data" }
                //];

                //var boxLabelRows = []


                //var boxLabelRow = {};
                //boxLabelRow['data'] = " Box Label:" + newManifestId;
                //boxLabelRows.push(boxLabelRow);
                //boxLabelRow = {};
                //boxLabelRow['data'] = "\n Vastec \n Hoffman Center Building 2034 Eisenhower Avenue, Suite 125.\n Alexandria. VA 22314 \n";
                //boxLabelRows.push(boxLabelRow);
                //boxLabelRow = {};
                //boxLabelRow['data'] = "\n " + jsPdfObj[0] + "\n 1101 Channelside Drive Suite 100 \n Tampa, FL 33602 \n";
                //boxLabelRows.push(boxLabelRow);
                //boxLabelRow = {};
                //boxLabelRow['data'] = " Personnel Office Identified (POID) level 1234";
                //boxLabelRows.push(boxLabelRow);
                //boxLabelRow = {};
                //boxLabelRow['data'] = " Destiny Manifest Creator";
                //boxLabelRows.push(boxLabelRow);
                //boxLabelRow = {};
                //boxLabelRow['data'] = " Printed: " + new Date().toLocaleString();
                //boxLabelRows.push(boxLabelRow);
                //boxLabelRow = {};
                //boxLabelRow['data'] = " Conversion Type: " + jsPdfObj[1];
                //boxLabelRows.push(boxLabelRow);

                //boxLabelDoc.autoTable(boxLabelColumns, boxLabelRows, {
                //    margin: { top: 50, left: 25, right: 25 },
                //    styles: { fontSize: 11, font: "helvetica", lineColor: 200 },
                //    drawHeaderRow: function (row, data) { return false; },
                //    theme: 'grid'
                //});

                //boxLabelDocumentBuffer = boxLabelDoc.output('arraybuffer');
                //attachFilesToListItem("Manifests", newManifestId, manifestAttachmentBuffer, boxLabelDocumentBuffer);
                //uploadFilesToDocumentLibrary(newManifestId, jsPdfObj[3], manifestAttachmentBuffer, boxLabelDocumentBuffer);
                ////retrieveManifestsData();

                //var Name = "Srini";
                //var servicePath = "/_layouts/15/WebService/WebService2.asmx";
                //var serviceURL = "http://sp2013" + servicePath;

                //var manifest = {};
                //manifest.Agency = jsPdfObj[0];
                //manifest.ConversionType = jsPdfObj[1];
                //var manifestItems = [];
                //for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                //    var manifestItem = {};
                //    manifestItem.SSN = rows[rowIndex]["ssn"];
                //    manifestItem.MergeStatus = rows[rowIndex]["mergestatus"];
                //    manifestItems.push(manifestItem);
                //}


                //var body = JSON.stringify({ name: manifest });
                //$.ajax({
                //    type: "POST",
                //    contentType: "application/json; charset=utf-8",
                //    url: serviceURL + "/HelloWorld",
                //    data: "{manifest:" + JSON.stringify(manifest) + ",manifestItems:" + JSON.stringify(manifestItems) + "}",
                //    dataType: "json",
                //    success: processResult,
                //    error: failure,
                //    crossDomain: true
                //});

                //var url = "http://sp2013";
                //var executor = new SP.RequestExecutor(url);
                //executor.executeAsync(
                //    {
                //        method: "POST",
                //        //contentType: "application/json; charset=utf-8",
                //        //contentType: "application/x-www-form-urlencoded",
                //        url: serviceURL + "/HelloWorld",
                //        body: body,
                //        headers: { "Accept": "application/json", "Content-Type": "application/json" },
                //        success: function (data2) {
                //            console.log(data2);
                //        },
                //        error: function (data) {
                //            console.log(data);
                //        }
                //    }
                //);

                ////Handle result
                //function processResult(xData) {
                //    var responseObject = jQuery.parseJSON(xData.d);
                //    //alert(responseObject.MyName);
                //}

                ////Handle Failure
                //function failure(all, textStatus, errorThrown) {
                //    console.log(textStatus);
                //    console.log(errorThrown);
                //}
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    var saveEditManifestData = function (manifestData, manifestItemsData) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');
        var guidToBeUsed = manifestData[4];

        var manifestListItem = manifestsList.getItemById(manifestData[0]);

        manifestListItem.set_item('Title', manifestData[1])
        manifestListItem.set_item('ConversionType', manifestData[2]);
        manifestListItem.set_item('Parcels', manifestData[3]);

        manifestListItem.update();

        clientContext.load(manifestListItem);

        for (var manifestItemIndex = 0; manifestItemIndex < manifestItemsData.length; manifestItemIndex++) {
            var manifestItem = manifestItemsData[manifestItemIndex];
            var newSsn = manifestItem[0];
            var newMergeStatus = manifestItem[1];
            var spId = manifestItem[2];

            if (spId == '') {

                var manifestItemCreateInfo = new SP.ListItemCreationInformation();
                var manifestItemListItem = manifestItemsList.addItem(manifestItemCreateInfo);
                manifestItemListItem.set_item('Title', newSsn);
                manifestItemListItem.set_item('MergeStatus', newMergeStatus);
                manifestItemListItem.set_item('ManifestID', guidToBeUsed);

                manifestItemListItem.update();
                clientContext.load(manifestItemListItem);
            }
            else {
                var manifestItemListItem = manifestItemsList.getItemById(spId);
                manifestItemListItem.set_item('Title', newSsn);
                manifestItemListItem.set_item('MergeStatus', newMergeStatus);

                manifestItemListItem.update();
                clientContext.load(manifestItemListItem);
            }
        }

        clientContext.executeQueryAsync(
            function (sender, args) {
                var newManifestId = manifestListItem.get_id();
                retrieveManifestsData();
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    //var deleteManifestsData = function (manifestId, manifestItemsData) {

    //    var siteUrl = _spPageContextInfo.webAbsoluteUrl;
    //    clientContext = new SP.ClientContext(siteUrl);
    //    var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
    //    var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

    //    var manifest = manifestsList.getItemById(manifestId);

    //    manifest.deleteObject();

    //    for (var manifestItemIndex = 0; manifestItemIndex < manifestItemsData.length; manifestItemIndex++) {
    //        var manifestItemId = manifestItemsData[manifestItemIndex];
    //        var manifestItem = manifestItemsList.getItemById(manifestItemId);
    //        manifestItem.deleteObject();
    //    }

    //    clientContext.executeQueryAsync(
    //        function (sender, args) {
    //            retrieveManifestsData();
    //        },
    //        function (sender, args) {
    //            alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
    //        }
    //    );
    //}

    var updatePriority = function (manifestId, priorityStatus) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        //var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var manifestItem = manifestItemsList.getItemById(manifestId);

        manifestItem.set_item("RequestPriority", priorityStatus);

        if (priorityStatus == true) {
            manifestItem.set_item("RequestPriorityDate", new Date());
        }
        else {
            manifestItem.set_item("CancelPriorityDate", new Date());
        }

        manifestItem.update();
        clientContext.load(manifestItem);
        clientContext.executeQueryAsync(
            function (sender, args) {
                //retrieveManifestsData();
                if (priorityStatus == true) {
                    //var servicePath = "/_layouts/15/VastecOPMSPWebService/WebService.asmx";
                    //var serviceURL = "http://test.devopm.com" + servicePath;
                    var serviceURL = CommonModule.getSPServiceUrl();

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: serviceURL + "/MakeManitestItemPriority",
                        data: "{agencyName:" + JSON.stringify(CommonModule.getAgencyName()) + ",spBoxManifestId:" + JSON.stringify(manifestId) + "}",
                        dataType: "json",
                        success: processResult,
                        error: failure,
                        crossDomain: true
                    });

                    //Handle result
                    function processResult(xData) {
                        var responseObject = jQuery.parseJSON(xData.d);
                        console.log(responseObject.Result);
                    }

                    //Handle Failure
                    function failure(all, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                }

                retrieveManifestsData();
            },
            function (sender, args) {
                //alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }


    var deleteManifestItemData = function (manifestItemId) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');
        var manifestItem = manifestItemsList.getItemById(manifestItemId);
        manifestItem.deleteObject();

        clientContext.executeQueryAsync(
            function (sender, args) {
                retrieveManifestsData();
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    //function getFormDigest(webUrl) {
    //    return $.ajax({
    //        url: webUrl + "/_api/contextinfo",
    //        method: "POST",
    //        headers: { "Accept": "application/json; odata=verbose" }
    //    });
    //}

    //function getFileBuffer(file) {
    //    var deferred = $.Deferred();
    //    var reader = new FileReader();
    //    reader.onload = function (e) {
    //        deferred.resolve(e.target.result);
    //    }
    //    reader.onerror = function (e) {
    //        deferred.reject(e.target.error);
    //    }
    //    reader.readAsArrayBuffer(file);
    //    return deferred.promise();
    //}

    //function attachFilesToListItem(listName, id, buffer, boxLabelDocumentBuffer) {

    //    var bytes = new Uint8Array(buffer);
    //    var content = new SP.Base64EncodedByteArray();

    //    var queryUrl = "/sites/PublishingSite/_api/web/lists/getbytitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='AgencyManifest.pdf')";

    //    $.ajax({
    //        url: queryUrl,
    //        type: "POST",
    //        processData: false,
    //        contentType: "application/json;odata=verbose",
    //        data: buffer,
    //        headers: {
    //            "accept": "application/json;odata=verbose",
    //            "X-RequestDigest": $("#__REQUESTDIGEST").val()
    //        },
    //        success: function (data) {
    //            var url = data.d.ServerRelativeUrl;

    //            $("#manifestDocumentSpan").append("<a href='" + url + "' target=_blank><u>Agency Manifest</u></a>");

    //            var queryUrl = "/sites/PublishingSite/_api/web/lists/getbytitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='BoxLabel.pdf')";

    //            $.ajax({
    //                url: queryUrl,
    //                type: "POST",
    //                processData: false,
    //                contentType: "application/json;odata=verbose",
    //                data: boxLabelDocumentBuffer,
    //                headers: {
    //                    "accept": "application/json;odata=verbose",
    //                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
    //                },
    //                success: function (data) {
    //                    var url = data.d.ServerRelativeUrl;

    //                    $("#manifestDocumentSpan").append("&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + url + "' target=_blank><u>BOX LABEL</u></a>");
    //                    retrieveManifestsData();
    //                },
    //                error: function (data) {
    //                    alert("Attachment Failure:" + error.status + "," + error.statusText);
    //                }
    //            });

    //        },
    //        error: function (data) {
    //            alert("Attachment Failure:" + error.status + "," + error.statusText);
    //        }
    //    });
    //}

    //function uploadFilesToDocumentLibrary(itemId, manifestId, agencyManifestDocumentBuffer, boxLabelDocumentBuffer) {

    //    var siteUrl = _spPageContextInfo.webAbsoluteUrl;
    //    clientContext = new SP.ClientContext(siteUrl);
    //    var manifestDocsList = clientContext.get_web().get_lists().getByTitle('ManifestDocs');

    //    var agencyManifestBytes = new Uint8Array(agencyManifestDocumentBuffer);
    //    var agencyManifestIndex, agencyManifestOut = '';
    //    for (agencyManifestIndex = 0; agencyManifestIndex < agencyManifestBytes.length; agencyManifestIndex++) {
    //        agencyManifestOut += String.fromCharCode(agencyManifestBytes[agencyManifestIndex]);
    //    }
    //    var agencyManifestBase64 = btoa(agencyManifestOut);

    //    var boxLabelBytes = new Uint8Array(boxLabelDocumentBuffer);
    //    var boxLabelIndex, boxLabelOut = '';
    //    for (boxLabelIndex = 0; boxLabelIndex < boxLabelBytes.length; boxLabelIndex++) {
    //        boxLabelOut += String.fromCharCode(boxLabelBytes[boxLabelIndex]);
    //    }
    //    var boxLabelBase64 = btoa(boxLabelOut);


    //    var agencyManifestDoc = new SP.FileCreationInformation();
    //    agencyManifestDoc.set_content(agencyManifestBase64);
    //    agencyManifestDoc.set_url("AgencyManifest" + itemId + ".pdf");

    //    var uploadedAgencyManifestDoc = manifestDocsList.get_rootFolder().get_files().add(agencyManifestDoc);
    //    var agencyManifestDocItem = uploadedAgencyManifestDoc.get_listItemAllFields();
    //    agencyManifestDocItem.set_item('ManifestID', manifestId);
    //    clientContext.load(uploadedAgencyManifestDoc);
    //    agencyManifestDocItem.update();
    //    clientContext.load(agencyManifestDocItem);

    //    var boxLabelDoc = new SP.FileCreationInformation();
    //    boxLabelDoc.set_content(boxLabelBase64);
    //    boxLabelDoc.set_url("BoxLabel" + itemId + ".pdf");

    //    var uploadedBoxLabelDoc = manifestDocsList.get_rootFolder().get_files().add(boxLabelDoc);
    //    var boxLabelDocItem = uploadedBoxLabelDoc.get_listItemAllFields();
    //    boxLabelDocItem.set_item('ManifestID', manifestId);
    //    clientContext.load(uploadedBoxLabelDoc);
    //    boxLabelDocItem.update();
    //    clientContext.load(boxLabelDocItem);

    //    clientContext.executeQueryAsync(
    //        function (sender, args) {
    //            console.log("Successfully uploaded documents to Manifest Docs library");
    //        },
    //        function (sender, args) {
    //            console.log("Error: " + args.get_message() + "\n" + args.get_stackTrace());
    //        }
    //    );
    //}

    function isNumber(evt) {
        var iKeyCode = (evt.which) ? evt.which : evt.keyCode

        if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
            return false;
        }

        return true;
    }

    function isSSN(element, evt) {
        var iKeyCode = (evt.which) ? evt.which : evt.keyCode

        if (iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
            return false;
        }

        //var newTable = $('#manifestElementsTableNew').DataTable()
        //newTable.row($(element).parent('td').parent('tr')).data()[2] = "122";
        //newTable.row($(element).parent('td').parent('tr')).data()[2].innerText = "123";
        return true;
    }

    return {
        initializeClickEvents: initializeClickEvents,
        retrieveManifestsData: retrieveManifestsData,
        saveNewManifestData: saveNewManifestData,
        saveEditManifestData: saveEditManifestData,
        //deleteManifestsData: deleteManifestsData,
        deleteManifestItemData: deleteManifestItemData,
        updatePriority: updatePriority,
        isNumber: isNumber,
        isSSN: isSSN
    }
})();