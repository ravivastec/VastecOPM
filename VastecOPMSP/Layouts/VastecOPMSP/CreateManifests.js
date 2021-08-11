$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations();
        ManifestsModule.initializeClickEvents();
        ManifestsModule.retrieveManifestsData();
        ManifestsModule.retrieveIntroductionText('Create Manifests', 'Introduction Text')
        CommonModule.retrieveHelpText('Create Manifests');
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
        $("#manifestElementsTableNew").on("click", ".manifest-items-table-delete", function () {

            var table = $('#manifestElementsTableNew').DataTable();

            //globalCounter--;

            //var manifestItemId = table.cell($(this).parent('td').parent('tr'), 2).nodes().to$().find('input').val();
            var manifestItemId = table.cell($(this).parent('td').parent('tr'), 4).nodes()[0].innerText;
            table.row($(this).parent('td').parent('tr')).remove().draw(false);
            //$(this).parent('td').parent('tr').children(":first").children(":first").val('');
            //$(this).parent('td').parent('tr').children(":nth-child(2)").children(":first").val('No');
            //$(this).parent('td').parent('tr').children(":nth-child(3)").children(":first").val('Folders manifested and received');

            var rowtitle = "manifest-element-title-" + globalCounter;
            var rowmergestatus = "manifest-element-mergestatus-" + globalCounter;
            var rowreconciliationstatus = "manifest-element-rowreconciliationstatus-" + globalCounter;
            var rowspid = "manifest-element-spid-" + globalCounter;
            globalCounter++;

            table.row.add([
                '<input type="text" id="' + rowtitle + '" name="' + rowtitle + '" onkeypress="javascript:return ManifestsModule.isSSN(this, event)" onkeyup="javascript:return CommonModule.changeFocus(this, event)" maxlength="11"/>',
                '<select id="' + rowmergestatus + '" name="' + rowmergestatus + '"><option value="Yes">Yes</option><option selected value="No">No</option></select>',
                '<select id="' + rowreconciliationstatus + '" name="' + rowreconciliationstatus + '">' +
                '<option value="Folders manifested and received">Folders manifested and received</option>' +
                '<option value="Folders manifested, but NOT received">Folders manifested, but NOT received</option>' +
                '<option value="Folders NOT manifested, but received">Folders NOT manifested, but received</option>' +
                '<option value="SSNs mistyped on the manifest">SSNs mistyped on the manifest</option>' +
                '</select>',
                '<span class="manifest-items-table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>',
                '',
                ''
            ]).draw(false);

            if (manifestItemId != '') {
                deleteManifestItemData(manifestItemId);
            }
        });

        /*Start Initialize New/Edit Html*/

        var globalCounter = 26;

        $('#addNewManifestElement').on('click', function () {

            var t = $('#manifestElementsTableNew').DataTable();
            var rowtitle = "manifest-element-title-" + globalCounter;
            var rowmergestatus = "manifest-element-mergestatus-" + globalCounter;
            var rowreconciliationstatus = "manifest-element-rowreconciliationstatus-" + globalCounter;
            var rowspid = "manifest-element-spid-" + globalCounter;
            /*Folders manifested and received
            Folders manifested, but NOT received
            Folders NOT manifested, but received
            SSNs mistyped on the manifest
            */
            t.row.add([
                '<input type="text" id="' + rowtitle + '" name="' + rowtitle + '" onkeypress="javascript:return ManifestsModule.isSSN(this, event)" onkeyup="javascript:return CommonModule.changeFocus(this, event)" maxlength="11"/>',
                //'<input type="checkbox" id="' + rowmergestatus + '" name="' + rowmergestatus + '">',
                '<select id="' + rowmergestatus + '" name="' + rowmergestatus + '"><option value="Yes">Yes</option><option selected value="No">No</option></select>',
                //'<input type="text" id="' + rowspid + '" name="' + rowspid + '"/>',
                '<select id="' + rowreconciliationstatus + '" name="' + rowreconciliationstatus + '">' +
                '<option value="Folders manifested and received">Folders manifested and received</option>' +
                '<option value="Folders manifested, but NOT received">Folders manifested, but NOT received</option>' +
                '<option value="Folders NOT manifested, but received">Folders NOT manifested, but received</option>' +
                '<option value="SSNs mistyped on the manifest">SSNs mistyped on the manifest</option>' +
                '</select>',
                '<span class="manifest-items-table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>',
                '',
                ''
            ]).draw(false);

            globalCounter++;
        });

        $("#createNewManifestButton").on('click', function () {
            $("#newParcel").val('');
            $("#newConversionType").val($("#newConversionType option:first").val());
            //$("#newAgency").val($("#newAgency option:first").val());
            $("#newPOID").val($("#newPOID option:first").val());
            $("#newStatus").val($("#newStatus option:first").val());
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
                        "width": "10%"
                    },
                    {
                        "targets": [1],
                        "width": "20%"
                    },
                    {
                        "targets": [2],
                        "width": "50%"
                    },
                    {
                        "targets": [3],
                        "width": "20%"
                    },
                    {
                        "targets": [4],
                        "visible": false
                    },
                    {
                        "targets": [5],
                        "visible": false
                    }
                ],
                destroy: true
            });

            newTable.clear().draw();

            // Precreate 25 rows

            for (var rowIndex = 1; rowIndex <= 25; rowIndex++) {
                var rowtitle = "manifest-element-title-" + rowIndex;
                var rowmergestatus = "manifest-element-mergestatus-" + rowIndex;
                var rowreconciliationstatus = "manifest-element-rowreconciliationstatus-" + rowIndex;

                newTable.row.add([
                    '<input type="text" id="' + rowtitle + '" name="' + rowtitle + '" onkeypress="javascript:return ManifestsModule.isSSN(this, event)" onkeyup="javascript:return CommonModule.changeFocus(this, event)" maxlength="11"/>',
                    '<select id="' + rowmergestatus + '" name="' + rowmergestatus + '"><option value="Yes">Yes</option><option selected value="No">No</option></select>',
                    '<select id="' + rowreconciliationstatus + '" name="' + rowreconciliationstatus + '">' +
                    '<option value="Folders manifested and received">Folders manifested and received</option>' +
                    '<option value="Folders manifested, but NOT received">Folders manifested, but NOT received</option>' +
                    '<option value="Folders NOT manifested, but received">Folders NOT manifested, but received</option>' +
                    '<option value="SSNs mistyped on the manifest">SSNs mistyped on the manifest</option>' +
                    '</select>',
                    '<span class="manifest-items-table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>',
                    '',
                    ''
                ]).draw(false);
            }


            //$("#popupTitle").text('New Manifest');
            $("#saveNewManifest").prop("disabled", false);
            $("#addNewManifestElement").prop("disabled", false);
            $("#manifestElementsTableNew").parent('div').removeClass("disabledbutton");
            $("#manifestDetailsInPopup").removeClass("disabledbutton");
        });
        //$('#addNewManifestElement').click();

        $('#saveNewManifest').on('click', function () {
            //var newAgency = $("#newAgency option:checked").val();
            var newAgency = CommonModule.getAgencyName();
            var newConversionType = $("#newConversionType option:checked").val();
            //var newParcel = $("#newParcel").val();
            var newPoid = $("#newPOID option:checked").val();
            var newStatus = "Created"; // $("#newStatus option:checked").val();
            var spId = $("#spId").val();
            var manifestId = $("#manifestId").val();


            //var newManifest = [];
            //newManifest.push(spId);
            //newManifest.push(newAgency);
            //newManifest.push(newConversionType);
            //newManifest.push(newParcel);
            //newManifest.push(manifestId);
            //newManifest.push(newPoid);
            //newManifest.push(newStatus);

            //if (newParcel == '') {
            //    alert("Parcels field is required! Please enter Parcels!");
            //    return false;
            //}

            var manifest = {};
            manifest.Agency = newAgency;
            manifest.ConversionType = newConversionType;
            //manifest.Parcels = newParcel;
            manifest.POID = newPoid;
            manifest.Status = newStatus;
            manifest.SPId = spId;
            manifest.manifestId = manifestId;



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
            manifestItemsNotInMasterList = [];

            for (var cellIndex = 0; cellIndex < data.length; cellIndex = cellIndex + 3) {

                if (data[cellIndex].value == '') {
                    //alert("SSN field is required, please enter valid SSN!");
                    //return false;
                    continue;
                }
                else if (validateSSN(data[cellIndex].value) == false) {
                    alert("SSN " + data[cellIndex].value + " is invalid, please enter valid SSN!");
                    return false;
                }
                else {
                    if (CommonModule.validateSSNLookup(data[cellIndex].value.replace(/-/g, ''), arrayOfSsnLookups) == false) {
                        //alert("SSN " + data[cellIndex].value + " not found, please enter valid SSN!");
                        //return false;

                        var manifestItemNotInMasterList = [];
                        manifestItemNotInMasterList.push(data[cellIndex].value.replace(/-/g, ''));
                        manifestItemsNotInMasterList.push(manifestItemNotInMasterList);
                    }
                }

                //var newManifestItem = [];
                //newManifestItem.push(data[cellIndex].value.replace(/-/g, ''));
                //newManifestItem.push(data[cellIndex + 1].value);
                ////newManifestItem.push(data[cellIndex + 2].value);
                //newManifestItem.push($('#manifestElementsTableNew').DataTable().rows().data()[rowIndex][2]);
                //newManifestItems.push(newManifestItem);

                var manifestItem = {};
                manifestItem.SSN = data[cellIndex].value.replace(/-/g, '');
                manifestItem.MergeStatus = data[cellIndex + 1].value;
                manifestItem.ReconciliationStatus = data[cellIndex + 2].value;
                manifestItem.SPId = $("#manifestElementsTableNew").DataTable().rows().data()[rowIndex][4];
                newManifestItems.push(manifestItem);

                rowIndex = rowIndex + 1;
            }

            $("#saveNewManifest").prop("disabled", true);
            $("#addNewManifestElement").prop("disabled", true);
            $("#manifestElementsTableNew").parent('div').addClass("disabledbutton");
            $("#manifestDetailsInPopup").addClass("disabledbutton");

            updatedManifest = manifest;
            updatedManifestItems = newManifestItems;

            manifest.Parcels = newManifestItems.length;

            if (manifestItemsNotInMasterList.length > 0) {

                $('#manifestItemsNotInMasterList').DataTable({
                    data: manifestItemsNotInMasterList,
                    destroy: true
                });

                $("#manifestItemsMasterListCheck").modal('show');
            }
            else {
                //if (typeof spId === 'undefined' || spId == '') {
                duplicateManifestItems = getDuplicateManifestItems(newManifestItems);

                //if (duplicateManifestItems.length == 0) {
                //    saveNewManifestData(manifest, newManifestItems);
                //}
                //else {
                //    $("#manifestItemsDuplicateCheck").modal('show');
                //}

                if (duplicateManifestItems.length > 0) {
                    $("#manifestItemsDuplicateCheck").modal('show');
                }
                else {
                    saveNewManifestData(manifest, newManifestItems);
                }
                //}
                //else {
                //    saveEditManifestData(newManifest, newManifestItems)
                //}
            }
        });

        $("#manifestItemsMasterListContinue").on('click', function () {
            $("#manifestItemsMasterListCheck").modal('hide');

            var siteUrl = _spPageContextInfo.webAbsoluteUrl;
            clientContext = new SP.ClientContext(siteUrl);
            var ssnLookupList = clientContext.get_web().get_lists().getByTitle('SSNLookup');

            for (var ssnLookupIndex = 0; ssnLookupIndex < manifestItemsNotInMasterList.length; ssnLookupIndex++) {
                var ssnLookupItemCreateInfo = new SP.ListItemCreationInformation();
                var ssnLookupListItem = ssnLookupList.addItem(ssnLookupItemCreateInfo);
                ssnLookupListItem.set_item('Title', manifestItemsNotInMasterList[ssnLookupIndex][0]);

                ssnLookupListItem.update();
                clientContext.load(ssnLookupListItem);
            }

            clientContext.executeQueryAsync(
                function (sender, args) {
                    console.log("Successfully created new item in the master list.");

                    duplicateManifestItems = getDuplicateManifestItems(updatedManifestItems);

                    if (duplicateManifestItems.length > 0) {
                        $("#manifestItemsDuplicateCheck").modal('show');
                    }
                    else {
                        saveNewManifestData(updatedManifest, updatedManifestItems);
                    }
                },
                function (sender, args) {
                    alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
                }
            );
        });

        $("#createDuplicates").on('click', function () {
            $("#manifestItemsDuplicateCheck").modal('hide');
            saveNewManifestData(updatedManifest, updatedManifestItems);
        });

        $("#overrideCurrentManifestItem").on('click', function () {
            $("#manifestItemsDuplicateCheck").modal('hide');

            for (var duplicateItemsIndex = 0; duplicateItemsIndex < duplicateManifestItems.length; duplicateItemsIndex++) {
                var duplicateManifestItem = duplicateManifestItems[duplicateItemsIndex];

                //var filteredUpdatedManifestItems = _.filter(updatedManifestItems, function (manifestItem) { return manifestItem.SSN == duplicateManifestItem.SSN; });

                for (var manifestItemIndex = 0; manifestItemIndex < updatedManifestItems.length; manifestItemIndex++) {
                    var manifestItem = updatedManifestItems[manifestItemIndex];

                    if (duplicateManifestItem.SSN == manifestItem.SSN) {
                        manifestItem.MergeStatus = duplicateManifestItem.MergeStatus;
                        manifestItem.ReconciliationStatus = duplicateManifestItem.ReconciliationStatus;
                        break;
                    }
                }

                for (var manifestItemIndex = updatedManifestItems.length - 1; manifestItemIndex >= 0; manifestItemIndex--) {
                    var manifestItem = updatedManifestItems[manifestItemIndex];

                    if (duplicateManifestItem.SSN == manifestItem.SSN) {
                        updatedManifestItems.splice(manifestItemIndex, 1);
                        break;
                    }
                }
            }

            saveNewManifestData(updatedManifest, updatedManifestItems);

            var newTable = $('#manifestElementsTableNew').DataTable();
            newTable.clear().draw();

            var localCounter = 1;

            for (index = 0; index < updatedManifestItems.length; index++) {

                var rowtitle = "manifest-element-title-" + localCounter;
                var rowmergestatus = "manifest-element-mergestatus-" + localCounter;
                var rowreconciliationstatus = "manifest-element-rowreconciliationstatus-" + localCounter;

                newTable.row.add([
                    '<input type="text" id="' + rowtitle + '" name="' + rowtitle + '" value="' + updatedManifestItems[index].SSN + '" onkeypress="javascript:return ManifestsModule.isSSN(this, event)" onkeyup="javascript:return CommonModule.changeFocus(this, event)" maxlength="11" disabled/>',
                    '<select id="' + rowmergestatus + '" name="' + rowmergestatus + '"><option value="Yes">Yes</option><option value="No">No</option></select>',
                    '<select id="' + rowreconciliationstatus + '" name="' + rowreconciliationstatus + '">' +
                    '<option value="Folders manifested and received">Folders manifested and received</option>' +
                    '<option value="Folders manifested, but NOT received">Folders manifested, but NOT received</option>' +
                    '<option value="Folders NOT manifested, but received">Folders NOT manifested, but received</option>' +
                    '<option value="SSNs mistyped on the manifest">SSNs mistyped on the manifest</option>' +
                    '</select>',
                    '<span class="manifest-items-table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>',
                    '',
                    ''
                ]).draw(false);

                $("#" + rowmergestatus).val(updatedManifestItems[index].MergeStatus);
                $("#" + rowreconciliationstatus).val(updatedManifestItems[index].ReconciliationStatus);

                localCounter++;
            }

            for (var rowIndex = localCounter; rowIndex <= 25; rowIndex++) {
                var rowtitle = "manifest-element-title-" + rowIndex;
                var rowmergestatus = "manifest-element-mergestatus-" + rowIndex;
                var rowreconciliationstatus = "manifest-element-rowreconciliationstatus-" + rowIndex;

                newTable.row.add([
                    '<input type="text" id="' + rowtitle + '" name="' + rowtitle + '" onkeypress="javascript:return ManifestsModule.isSSN(this, event)" onkeyup="javascript:return CommonModule.changeFocus(this, event)" maxlength="11"/>',
                    '<select id="' + rowmergestatus + '" name="' + rowmergestatus + '"><option value="Yes">Yes</option><option selected value="No">No</option></select>',
                    '<select id="' + rowreconciliationstatus + '" name="' + rowreconciliationstatus + '">' +
                    '<option value="Folders manifested and received">Folders manifested and received</option>' +
                    '<option value="Folders manifested, but NOT received">Folders manifested, but NOT received</option>' +
                    '<option value="Folders NOT manifested, but received">Folders NOT manifested, but received</option>' +
                    '<option value="SSNs mistyped on the manifest">SSNs mistyped on the manifest</option>' +
                    '</select>',
                    '<span class="manifest-items-table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>',
                    '',
                    ''
                ]).draw(false);
            }
        });

        function validateSSN(elementValue) {
            var ssnPattern = /^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/;
            return ssnPattern.test(elementValue);
        }

        $("#manifestsTable").on("click", ".table-select", function () {
            var table = $('#manifestsTable').DataTable();

            var guidLookup = $(this).parent('td').parent('tr').find("td:nth-child(6)")[0].innerText;
            guidLookup = table.row($(this).parent('td').parent('tr')).data()[6];

            if (guidLookup != '') {
                var filteredmanifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.manifestid == guidLookup; });
                console.log(filteredmanifestElements);

                var manifestElements = new Array();

                for (index = 0; index < filteredmanifestElements.length; index++) {

                    var manifestElement = [];
                    manifestElement.push(filteredmanifestElements[index].title);
                    manifestElement.push(filteredmanifestElements[index].mergeStatus);
                    manifestElement.push(filteredmanifestElements[index].reconciliationStatus);
                    manifestElement.push(filteredmanifestElements[index].createdBy);
                    manifestElement.push(filteredmanifestElements[index].modifiedBy);
                    manifestElement.push(filteredmanifestElements[index].id);
                    manifestElement.push(filteredmanifestElements[index].manifestid);
                    manifestElements.push(manifestElement);
                }

                $('#manifestElementsTable').DataTable({
                    data: manifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN" },
                        { title: "Merge Status" },
                        { title: "Reconciliation Status" },
                        { title: "Created By" },
                        { title: "Modified By" },
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id", visible: false }
                    ]
                });
            }
            else {
                var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                $(this).parents('tr').find("td.guid-id")[0].innerText = guid;
            }

            CommonModule.highLightRow($(this).parent('td').parent('tr'));
        });

        //$.fn.dataTableExt.ofnSearch['html-input'] = function (value) {
        //    return $(value).val();
        //};

        //var table = $("#manifestElementsTableNew").DataTable({
        //    columnDefs: [
        //        { "type": "html-input", "targets": [0, 1] }
        //    ]
        //});

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
                    return _.find(filteredmanifestElements, function (filteredmanifestElement) { return manifestElement[6] == filteredmanifestElement.manifestid; });
                });

                $('#manifestsTable').DataTable({
                    data: filteredManifests,
                    destroy: true,
                    pageLength: 25,
                    columns: [
                        { title: "Agency", width: "10%" },
                        { title: "Box Number", width: "10%" },
                        { title: "POID", width: "7%" },
                        { title: "Conversion Type", width: "25%" },
                        { title: "Folders", width: "10%" },
                        { title: "Status", width: "8%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "View", visible: false, sorting: false, width: "8%", className: "text-center-align" },
                        { title: "Edit", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Delete", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Agency Manifest", sorting: false, width: "15%", className: "text-center-align" },
                        { title: "Box Label", sorting: false, width: "15%", className: "text-center-align" }
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
            $('#manifestsTable').DataTable({
                data: arrayOfmanifests,
                destroy: true,
                pageLength: 25,
                columns: [
                    { title: "Agency", width: "10%" },
                    { title: "Box Number", width: "10%" },
                    { title: "POID", width: "7%" },
                    { title: "Conversion Type", width: "25%" },
                    { title: "Folders", width: "10%" },
                    { title: "Status", width: "8%" },
                    { title: "Manifest Id Lookup", visible: false },
                    { title: "View", visible: false, sorting: false, width: "8%", className: "text-center-align" },
                    { title: "Edit", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                    { title: "Delete", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                    { title: "Agency Manifest", sorting: false, width: "15%", className: "text-center-align" },
                    { title: "Box Label", sorting: false, width: "15%", className: "text-center-align" }
                ]
            });

            $('#manifestElementsTable').DataTable().clear().draw();
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

        manifestsColl = manifestsList.getItems(camlQuery);
        manifestElementsColl = manifestElementsList.getItems(camlQuery);
        ssnLookupColl = ssnLookupList.getItems(camlQuery);

        var conversionType = manifestsList.get_fields().getByInternalNameOrTitle("ConversionType");
        var conversionTypeChoiceField = clientContext.castTo(conversionType, SP.FieldChoice);

        var status = manifestsList.get_fields().getByInternalNameOrTitle("Status");
        var statusChoiceField = clientContext.castTo(status, SP.FieldChoice);

        clientContext.load(manifestsColl, 'Include(Title, POID, ConversionType, Parcels, ID, ManifestID, Status, Attachments, AttachmentFiles)');
        clientContext.load(manifestElementsColl);
        clientContext.load(ssnLookupColl);
        clientContext.load(conversionTypeChoiceField);
        clientContext.load(statusChoiceField);

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
                    var poid = manifestsListItem.get_item('POID');
                    var conversionType = manifestsListItem.get_item('ConversionType');
                    var parcels = manifestsListItem.get_item('Parcels');
                    var status = manifestsListItem.get_item('Status');
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
                    manifest.push(id);
                    manifest.push(poid);
                    manifest.push(conversionType);
                    manifest.push(parcels);
                    manifest.push(status);
                    manifest.push(manifestid);
                    manifest.push('<span class="table-select glyphicon glyphicon-check cursor-pointer btn btn-info" title="Select"></span>');
                    //manifest.push('<button type="button" class="table-edit btn btn-info" data-toggle="modal" data-target="#createNewManifest"><span class="glyphicon glyphicon-edit cursor-pointer" title="Edit"></span></button>');
                    //manifest.push('<span class="table-edit glyphicon glyphicon-edit cursor-pointer btn btn-info" data-toggle="modal" data-target="#createNewManifest" title="Edit"></span>');
                    manifest.push('<span class="table-edit glyphicon glyphicon-edit cursor-pointer btn btn-default" style="cursor:not-allowed"></span>');
                    manifest.push('<span class="table-delete glyphicon glyphicon-remove cursor-pointer btn btn-info" title="Delete"></span>');

                    var agencyManifestDocumentHtml = '';
                    var boxLabelDocumentHtml = '';

                    if (agencyManifestLink != '') {
                        var downloadAgencyManifestDocument = '<a href="' + agencyManifestLink + '" target="_blank"><span class="glyphicon glyphicon-download cursor-pointer btn btn-info" title="Download Agency Manifest"></span></a>'
                        var printAgencyManifestDocument = '<a href="#" onclick="printJS(\'' + agencyManifestLink + '\')"><span class="glyphicon glyphicon-print cursor-pointer btn btn-info" title="Print Agency Manifest"></span></a>'
                        agencyManifestDocumentHtml = downloadAgencyManifestDocument + "  " + printAgencyManifestDocument;
                    }

                    if (boxLabelLink != '') {
                        var downloadBoxLabelDocument = '<a href="' + boxLabelLink + '" target="_blank"><span class="glyphicon glyphicon-download cursor-pointer btn btn-info" title="Download Box Label"></span></a>'
                        var printBoxLabelDocument = '<a href="#" onclick="printJS(\'' + boxLabelLink + '\')"><span class="glyphicon glyphicon-print cursor-pointer btn btn-info" title="Print Box Label"></span></a>'
                        boxLabelDocumentHtml = downloadBoxLabelDocument + "  " + printBoxLabelDocument;
                    }

                    manifest.push(agencyManifestDocumentHtml);
                    manifest.push(boxLabelDocumentHtml);

                    manifests.push(manifest);
                }

                arrayOfmanifests = manifests;

                var manifestElementsListItemEnumerator = manifestElementsColl.getEnumerator();

                arrayOfmanifestElements = new Array();

                $('#manifestsTable').DataTable({
                    data: manifests,
                    destroy: true,
                    pageLength: 25,
                    columns: [
                        { title: "Agency", width: "10%" },
                        { title: "Box Number", width: "10%" },
                        { title: "POID", width: "7%" },
                        { title: "Conversion Type", width: "25%" },
                        { title: "Folders", width: "10%" },
                        { title: "Status", width: "8%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "View", visible: false, sorting: false, width: "8%", className: "text-center-align" },
                        { title: "Edit", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Delete", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Agency Manifest", sorting: false, width: "15%", className: "text-center-align" },
                        { title: "Box Label", sorting: false, width: "15%", className: "text-center-align" }
                    ]
                });

                $('#manifestElementsTable').DataTable({
                    data: arrayOfmanifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN" },
                        { title: "Merge Status" },
                        { title: "Reconciliation Status" },
                        { title: "Created By" },
                        { title: "Modified By" },
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id", visible: false }
                    ]
                });

                while (manifestElementsListItemEnumerator.moveNext()) {
                    var manifestElementsListItem = manifestElementsListItemEnumerator.get_current();
                    var title = manifestElementsListItem.get_item('Title');
                    var mergeStatus = manifestElementsListItem.get_item('MergeStatus');
                    var reconciliationStatus = manifestElementsListItem.get_item('ReconciliationStatus');
                    var createdBy = manifestElementsListItem.get_fieldValues()['Author'].get_lookupValue();
                    var modifiedBy = manifestElementsListItem.get_fieldValues()['Editor'].get_lookupValue();
                    var id = manifestElementsListItem.get_item('ID');
                    var manifestid = manifestElementsListItem.get_item('ManifestID');

                    var guidId = "guid" + id;

                    var manifestElement = {
                        title: title,
                        mergeStatus: mergeStatus,
                        reconciliationStatus: reconciliationStatus,
                        createdBy: createdBy,
                        modifiedBy: modifiedBy,
                        id: id,
                        manifestid: manifestid
                    }

                    arrayOfmanifestElements.push(manifestElement);
                }

                currentUserName = currentUser.get_title()

                var ssnLookupListItemEnumerator = ssnLookupColl.getEnumerator();
                arrayOfSsnLookups = new Array();

                while (ssnLookupListItemEnumerator.moveNext()) {
                    var ssnLookupListItem = ssnLookupListItemEnumerator.get_current();
                    var ssn = ssnLookupListItem.get_item('Title');

                    arrayOfSsnLookups.push(ssn.replace(/-/g, ''));
                }

                $('#newConversionType option').each(function () {
                    $(this).remove();
                });

                var conversionTypeChoiceFieldDistinctChoices = conversionTypeChoiceField.get_choices();

                for (var choiceIndex = 0; choiceIndex < conversionTypeChoiceFieldDistinctChoices.length; choiceIndex++) {
                    var conversionTypeValue = conversionTypeChoiceFieldDistinctChoices[choiceIndex];
                    $("#newConversionType").append("<option value='" + conversionTypeValue + "'>" + conversionTypeValue + "</option>");
                }

                $('#newStatus option').each(function () {
                    $(this).remove();
                });

                var statusChoiceFieldDistinctChoices = statusChoiceField.get_choices();

                for (var statusIndex = 0; statusIndex < statusChoiceFieldDistinctChoices.length; statusIndex++) {
                    var statusValue = statusChoiceFieldDistinctChoices[statusIndex];
                    $("#newStatus").append("<option value='" + statusValue + "'>" + statusValue + "</option>");
                }

                //var servicePath = "/_layouts/15/VastecOPMSPWebService/WebService.asmx";
                //var serviceURL = "http://test.devopm.com" + servicePath;
                var serviceURL = CommonModule.getSPServiceUrl();
                console.log(serviceURL);
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

                    $('#newPOID option').each(function () {
                        $(this).remove();
                    });

                    for (var poidIndex = 0; poidIndex < responseObject.Result.length; poidIndex++) {
                        var poid = responseObject.Result[poidIndex];

                        var projectOfficeIdentifierId = poid.ProjectOfficeIdentifierId;
                        var streetAddress = poid.StreetAddress;
                        var officeIdentifier = poid.OfficeIdentifier;

                        $("#newPOID").append("<option value='" + projectOfficeIdentifierId + "'>" + officeIdentifier + " - " + streetAddress + "</option>");
                    }
                }

                //Handle Failure
                function failure(all, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }

                console.log("End Time: " + new Date().toLocaleString());
            },
            function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }
        );
    }

    var manifestListItem;
    var manifestItemListItemColl;
    var manifestAttachmentBuffer;
    var boxLabelDocumentBuffer;
    var jsPdfObj;

    var updatedManifest;
    var updatedManifestItems;
    var duplicateManifestItems;
    var manifestItemsNotInMasterList = [];

    var getDuplicateManifestItems = function (manifestItemsData) {

        var duplicateManifestItems = [];

        for (var manifestItemIndex = manifestItemsData.length - 1; manifestItemIndex >= 0; manifestItemIndex--) {
            var manifestItem = manifestItemsData[manifestItemIndex];

            if (manifestItem.SPId == '') {
                for (var manifestItemIndexInner = manifestItemIndex - 1; manifestItemIndexInner >= 0; manifestItemIndexInner--) {
                    var manifestItemInner = manifestItemsData[manifestItemIndexInner];

                    if (manifestItem.SSN == manifestItemInner.SSN) {
                        duplicateManifestItems.push(manifestItem);
                        break;
                    }
                }
            }
        }

        return duplicateManifestItems;
    }

    var saveNewManifestData = function (manifestData, manifestItemsData) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');
        var guidToBeUsed = '';

        if (manifestData.Agency != '') {

            var itemCreateInfo = new SP.ListItemCreationInformation();
            manifestListItem = manifestsList.addItem(itemCreateInfo);

            var newGuid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
            manifestListItem.set_item('Title', manifestData.Agency);
            manifestListItem.set_item('ConversionType', manifestData.ConversionType);
            manifestListItem.set_item('Parcels', manifestData.Parcels);
            manifestListItem.set_item('POID', manifestData.POID);
            manifestListItem.set_item('Status', manifestData.Status);
            manifestListItem.set_item('ManifestID', newGuid);

            manifestListItem.update();

            clientContext.load(manifestListItem);

            jsPdfObj = [];
            jsPdfObj.push(manifestData.Agency);
            jsPdfObj.push(manifestData.ConversionType);
            jsPdfObj.push(manifestData.Parcels);
            jsPdfObj.push(manifestData.POID);
            jsPdfObj.push(newGuid);

            manifestItemListItemColl = [];

            for (var manifestItemIndex = 0; manifestItemIndex < manifestItemsData.length; manifestItemIndex++) {
                var manifestItem = manifestItemsData[manifestItemIndex];
                //var newSsn = manifestItem[0];
                //var newMergeStatus = manifestItem[1];

                var newSsn = manifestItem.SSN;
                var newMergeStatus = manifestItem.MergeStatus;
                var newReconciliationStatus = manifestItem.ReconciliationStatus;

                var manifestItemCreateInfo = new SP.ListItemCreationInformation();
                var manifestItemListItem = manifestItemsList.addItem(manifestItemCreateInfo);
                manifestItemListItem.set_item('Title', newSsn);
                manifestItemListItem.set_item('MergeStatus', newMergeStatus);
                manifestItemListItem.set_item('ReconciliationStatus', newReconciliationStatus);
                manifestItemListItem.set_item('ManifestID', newGuid);

                manifestItemListItem.update();
                manifestItemListItemColl.push(manifestItemListItem);
                clientContext.load(manifestItemListItem);

                jsPdfItemObj = [];
                jsPdfItemObj.push(newSsn);
                jsPdfItemObj.push(newMergeStatus);
                jsPdfObj.push(jsPdfItemObj);
            }
        }

        clientContext.executeQueryAsync(
            function (sender, args) {
                var newManifestId = manifestListItem.get_id();
                //var newManifestItemId = manifestItemListItem.get_id();

                var doc = new jsPDF();
                doc.setFont("helvetica");
                doc.setFontSize(28);
                doc.text(25, 30, 'Agency Manifest');

                doc.setFontSize(16);
                doc.text(25, 40, 'Agency: ' + jsPdfObj[0]);
                doc.text(25, 50, 'Conversion Type: ' + jsPdfObj[1]);
                doc.text(25, 60, 'Box/Manifest ID: ' + newManifestId);
                doc.text(25, 70, 'Number of Parcels: ' + jsPdfObj[2]);

                var columns = [
                    { title: "SSN", dataKey: "ssn" },
                    { title: "Batch ID", dataKey: "batchid" },
                    { title: "Merge Status", dataKey: "mergestatus" },
                    { title: "Date/Time Added", dataKey: "datetime" },
                    { title: "Manifest User", dataKey: "createduser" }
                ];

                var rows = []


                if (jsPdfObj.length > 5) {

                    var dateTime = new Date();
                    var month = dateTime.getMonth() + 1;
                    var day = dateTime.getDate();
                    var year = dateTime.getFullYear();

                    for (index = 5; index < jsPdfObj.length; index++) {
                        var row = {};
                        row['ssn'] = jsPdfObj[index][0];
                        row['batchid'] = newManifestId;
                        row['mergestatus'] = jsPdfObj[index][1];
                        row['datetime'] = month + '/' + day + '/' + year;
                        row['createduser'] = currentUserName;
                        rows.push(row);
                    }
                }

                doc.autoTable(columns, rows, {
                    headerStyles: { fillColor: [0, 51, 102] },
                    margin: { top: 100, left: 25, right: 25 },
                    styles: { fontSize: 11, font: "helvetica" },
                    theme: 'grid'
                });

                doc.setFont("helvetica");
                doc.setFontSize(11);
                doc.text(25, 255, "Agency Signature: ___________________________________Date: ____________________");
                doc.text(25, 270, "Scanning Facility Signature: ___________________________Date: ____________________");

                manifestAttachmentBuffer = doc.output('arraybuffer');

                var boxLabelDoc = new jsPDF();
                boxLabelDoc.setFont("helvetica");
                boxLabelDoc.setFontSize(28);
                boxLabelDoc.text(25, 30, 'BOX LABEL');


                var boxLabelColumns = [
                    { title: "Hidden Column", dataKey: "data" }
                ];

                var dateTime = new Date();
                var month = dateTime.getMonth() + 1;
                var day = dateTime.getDate();
                var year = dateTime.getFullYear();
                var hours = addZero(dateTime.getHours());
                var minutes = addZero(dateTime.getMinutes());
                var seconds = addZero(dateTime.getSeconds());
                var currentDateTime = month + "/" + day + "/" + year + ", " + hours + ":" + minutes + ":" + seconds;

                var boxLabelRows = []

                var boxLabelRow = {};
                boxLabelRow['data'] = " Box Label:" + newManifestId;
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                boxLabelRow['data'] = "\n Vastec \n Hoffman Center Building 2034 Eisenhower Avenue, Suite 125.\n Alexandria. VA 22314 \n";
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                boxLabelRow['data'] = "\n " + jsPdfObj[0] + "\n 1101 Channelside Drive Suite 100 \n Tampa, FL 33602 \n";
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                boxLabelRow['data'] = " Personnel Office Identified (POID) level " + jsPdfObj[3];
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                boxLabelRow['data'] = " Destiny Manifest Creator";
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                //boxLabelRow['data'] = " Printed: " + new Date().toLocaleString();
                boxLabelRow['data'] = " Printed: " + currentDateTime;
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                boxLabelRow['data'] = " Conversion Type: " + jsPdfObj[1];
                boxLabelRows.push(boxLabelRow);

                boxLabelDoc.autoTable(boxLabelColumns, boxLabelRows, {
                    margin: { top: 50, left: 25, right: 25 },
                    styles: { fontSize: 11, font: "helvetica", lineColor: 200 },
                    drawHeaderRow: function (row, data) { return false; },
                    theme: 'grid'
                });

                boxLabelDocumentBuffer = boxLabelDoc.output('arraybuffer');
                attachFilesToListItem("Manifests", newManifestId, manifestAttachmentBuffer, boxLabelDocumentBuffer);
                uploadFilesToDocumentLibrary(newManifestId, jsPdfObj[3], manifestAttachmentBuffer, boxLabelDocumentBuffer);
                //retrieveManifestsData();


                //var servicePath = "/_layouts/15/VastecOPMSPWebService/WebService.asmx";
                //var serviceURL = "http://test.devopm.com" + servicePath;
                var serviceURL = CommonModule.getSPServiceUrl();

                var manifest = {};
                manifest.Agency = jsPdfObj[0];
                manifest.ConversionType = jsPdfObj[1];
                manifest.SPManifestId = newManifestId;
                manifest.Parcels = jsPdfObj[2];
                manifest.ProjectOfficeIdentifierId = jsPdfObj[3];

                var manifestItems = [];
                for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    var manifestItem = {};
                    manifestItem.SSN = rows[rowIndex]["ssn"];
                    manifestItem.MergeStatus = rows[rowIndex]["mergestatus"];
                    manifestItem.SPManifestId = manifestItemListItemColl[rowIndex].get_id();
                    manifestItems.push(manifestItem);
                }

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: serviceURL + "/CreateManifests",
                    data: "{manifest:" + JSON.stringify(manifest) + ",manifestItems:" + JSON.stringify(manifestItems) + "}",
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

    var deleteManifestsData = function (manifestId, manifestItemsData) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var manifest = manifestsList.getItemById(manifestId);

        manifest.deleteObject();

        for (var manifestItemIndex = 0; manifestItemIndex < manifestItemsData.length; manifestItemIndex++) {
            var manifestItemId = manifestItemsData[manifestItemIndex];
            var manifestItem = manifestItemsList.getItemById(manifestItemId);
            manifestItem.deleteObject();
        }

        clientContext.executeQueryAsync(
            function (sender, args) {
                retrieveManifestsData();
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
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

    var helpTextListColl = '';

    var retrieveIntroductionText = function (screenName, helpTextType) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var helpTextList = clientContext.get_web().get_lists().getByTitle('HelpText');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View Scope="Recursive"><Query><Where><And><Eq><FieldRef Name="ScreenName"/><Value Type="Text">' + screenName + '</Value></Eq><Eq><FieldRef Name="HelpTextType"/><Value Type="Text">' + helpTextType + '</Value></Eq></And></Where></Query></View>');

        helpTextListColl = helpTextList.getItems(camlQuery);
        clientContext.load(helpTextListColl);

        clientContext.executeQueryAsync(
            function (sender, args) {
                var helpTextListItemEnumerator = helpTextListColl.getEnumerator();

                while (helpTextListItemEnumerator.moveNext()) {
                    var helpTextListItem = helpTextListItemEnumerator.get_current();
                    var helpText = helpTextListItem.get_item('HelpText');

                    $("#manifestIntroductionText").html(helpText);
                }
            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    var addZero = function (value) {
        if (value < 10) {
            value = "0" + value;
        }
        return value;
    }

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    function getFormDigest(webUrl) {
        return $.ajax({
            url: webUrl + "/_api/contextinfo",
            method: "POST",
            headers: { "Accept": "application/json; odata=verbose" }
        });
    }

    function getFileBuffer(file) {
        var deferred = $.Deferred();
        var reader = new FileReader();
        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(file);
        return deferred.promise();
    }

    function attachFilesToListItem(listName, id, buffer, boxLabelDocumentBuffer) {

        var bytes = new Uint8Array(buffer);
        var content = new SP.Base64EncodedByteArray();

        var queryUrl = "/_api/web/lists/getbytitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='AgencyManifest.pdf')";

        $.ajax({
            url: queryUrl,
            type: "POST",
            processData: false,
            contentType: "application/json;odata=verbose",
            data: buffer,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                //var url = data.d.ServerRelativeUrl;

                //$("#manifestDocumentSpan").append("<a href='" + url + "' target=_blank><u>Agency Manifest</u></a>");

                var agencyManifestLink = data.d.ServerRelativeUrl;

                var downloadAgencyManifestDocument = '<a href="' + agencyManifestLink + '" target="_blank"><span class="glyphicon glyphicon-download cursor-pointer btn btn-info" title="Download Agency Manifest"></span></a>'
                var printAgencyManifestDocument = '<a href="#" onclick="printJS(\'' + agencyManifestLink + '\')"><span class="glyphicon glyphicon-print cursor-pointer btn btn-info" title="Print Agency Manifest"></span></a>'
                var agencyManifestDocumentHtml = downloadAgencyManifestDocument + "  " + printAgencyManifestDocument;

                $("#manifestDocumentSpan").append(agencyManifestDocumentHtml);

                var queryUrl = "/_api/web/lists/getbytitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='BoxLabel.pdf')";

                $.ajax({
                    url: queryUrl,
                    type: "POST",
                    processData: false,
                    contentType: "application/json;odata=verbose",
                    data: boxLabelDocumentBuffer,
                    headers: {
                        "accept": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                    success: function (data) {
                        var boxLabelLink = data.d.ServerRelativeUrl;

                        var downloadBoxLabelDocument = '<a href="' + boxLabelLink + '" target="_blank"><span class="glyphicon glyphicon-download cursor-pointer btn btn-info" title="Download Box Label"></span></a>'
                        var printBoxLabelDocument = '<a href="#" onclick="printJS(\'' + boxLabelLink + '\')"><span class="glyphicon glyphicon-print cursor-pointer btn btn-info" title="Print Box Label"></span></a>'
                        var boxLabelDocumentHtml = downloadBoxLabelDocument + "  " + printBoxLabelDocument;

                        $("#manifestDocumentSpan").append("&nbsp;&nbsp;&nbsp;&nbsp;" + boxLabelDocumentHtml);

                        //$("#manifestDocumentSpan").append("&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + url + "' target=_blank><u>Box Label</u></a>");
                        retrieveManifestsData();
                    },
                    error: function (data) {
                        alert("Attachment Failure:" + error.status + "," + error.statusText);
                    }
                });

            },
            error: function (data) {
                alert("Attachment Failure:" + error.status + "," + error.statusText);
            }
        });
    }

    function uploadFilesToDocumentLibrary(itemId, manifestId, agencyManifestDocumentBuffer, boxLabelDocumentBuffer) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestDocsList = clientContext.get_web().get_lists().getByTitle('ManifestDocs');

        var agencyManifestBytes = new Uint8Array(agencyManifestDocumentBuffer);
        var agencyManifestIndex, agencyManifestOut = '';
        for (agencyManifestIndex = 0; agencyManifestIndex < agencyManifestBytes.length; agencyManifestIndex++) {
            agencyManifestOut += String.fromCharCode(agencyManifestBytes[agencyManifestIndex]);
        }
        var agencyManifestBase64 = btoa(agencyManifestOut);

        var boxLabelBytes = new Uint8Array(boxLabelDocumentBuffer);
        var boxLabelIndex, boxLabelOut = '';
        for (boxLabelIndex = 0; boxLabelIndex < boxLabelBytes.length; boxLabelIndex++) {
            boxLabelOut += String.fromCharCode(boxLabelBytes[boxLabelIndex]);
        }
        var boxLabelBase64 = btoa(boxLabelOut);


        var agencyManifestDoc = new SP.FileCreationInformation();
        agencyManifestDoc.set_content(agencyManifestBase64);
        agencyManifestDoc.set_url("AgencyManifest" + itemId + ".pdf");

        var uploadedAgencyManifestDoc = manifestDocsList.get_rootFolder().get_files().add(agencyManifestDoc);
        var agencyManifestDocItem = uploadedAgencyManifestDoc.get_listItemAllFields();
        agencyManifestDocItem.set_item('ManifestID', manifestId);
        clientContext.load(uploadedAgencyManifestDoc);
        agencyManifestDocItem.update();
        clientContext.load(agencyManifestDocItem);

        var boxLabelDoc = new SP.FileCreationInformation();
        boxLabelDoc.set_content(boxLabelBase64);
        boxLabelDoc.set_url("BoxLabel" + itemId + ".pdf");

        var uploadedBoxLabelDoc = manifestDocsList.get_rootFolder().get_files().add(boxLabelDoc);
        var boxLabelDocItem = uploadedBoxLabelDoc.get_listItemAllFields();
        boxLabelDocItem.set_item('ManifestID', manifestId);
        clientContext.load(uploadedBoxLabelDoc);
        boxLabelDocItem.update();
        clientContext.load(boxLabelDocItem);

        clientContext.executeQueryAsync(
            function (sender, args) {
                console.log("Successfully uploaded documents to Manifest Docs library");
            },
            function (sender, args) {
                console.log("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

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

        return true;
    }   

    return {
        initializeClickEvents: initializeClickEvents,
        retrieveManifestsData: retrieveManifestsData,
        retrieveIntroductionText: retrieveIntroductionText,
        saveNewManifestData: saveNewManifestData,
        saveEditManifestData: saveEditManifestData,
        deleteManifestsData: deleteManifestsData,
        deleteManifestItemData: deleteManifestItemData,
        isNumber: isNumber,
        isSSN: isSSN
    }
})();