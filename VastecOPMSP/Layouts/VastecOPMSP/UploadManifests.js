$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations();
        ManifestsModule.initializeFileSelect();
        ManifestsModule.retrieveCurrentUserName();
        ManifestsModule.initializeClickEvents();
        ManifestsModule.retrieveManifestsData();
    }
});

var ManifestsModule = (function () {

    var file;
    var currentUserName;
    var fileResults;

    function initializeFileSelect() {
        $('#manifestsFile').change(function (e) {
            file = e.target.files[0];

            if (typeof file != 'undefined') {
                enableButton();
            }
        });

        $('#statusDiv').hide();
    }

    var initializeClickEvents = function () {

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

        $("#manifestsTable").on("click", ".table-delete", function () {

            var table = $('#manifestsTable').DataTable();

            //$(this).parent('td').parent('tr').detach();
            var manifestId = table.row($(this).parent('td').parent('tr')).data()[3];
            var guidLookup = table.row($(this).parent('td').parent('tr')).data()[4];

            if (guidLookup != '') {
                var filteredmanifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.manifestid == guidLookup; });

                var manifestItemsIds = new Array();

                for (index = 0; index < filteredmanifestElements.length; index++) {
                    manifestItemsIds.push(filteredmanifestElements[index].id);
                }
            }

            deleteManifestsData(manifestId, manifestItemsIds);
        });

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
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id", visible: false }
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
                    return _.find(filteredmanifestElements, function (filteredmanifestElement) { return manifestElement[6] == filteredmanifestElement.manifestid; });
                });

                $('#manifestsTable').DataTable({
                    data: filteredManifests,
                    destroy: true,
                    columns: [
                        { title: "Agency", width: "10%" },
                        { title: "POID", width: "10%" },
                        { title: "Conversion Type", width: "15%" },
                        { title: "Parcels (Boxes)", width: "12%" },
                        { title: "Manifest Id", width: "10%" },
                        { title: "Status", width: "10%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "View", sorting: false, width: "8%", className: "text-center-align" },
                        { title: "Edit", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Delete", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Agency Manifest", sorting: false, width: "15%", className: "text-center-align" },
                        { title: "Box Label", sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Uploaded Document", sorting: false, width: "10%", className: "text-center-align" }
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
                columns: [
                    { title: "Agency", width: "10%" },
                    { title: "POID", width: "10%" },
                    { title: "Conversion Type", width: "15%" },
                    { title: "Parcels (Boxes)", width: "12%" },
                    { title: "Manifest Id", width: "10%" },
                    { title: "Status", width: "10%" },
                    { title: "Manifest Id Lookup", visible: false },
                    { title: "View", sorting: false, width: "8%", className: "text-center-align" },
                    { title: "Edit", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                    { title: "Delete", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                    { title: "Agency Manifest", sorting: false, width: "15%", className: "text-center-align" },
                    { title: "Box Label", sorting: false, width: "10%", className: "text-center-align" },
                    { title: "Uploaded Document", sorting: false, width: "10%", className: "text-center-align" }
                ]
            });

            $('#manifestElementsTable').DataTable().clear().draw();
        }

        $('#continueImportFile').on('click', function () {
            uploadManifestData(fileResults);
            $('#ssnWithDayForward').modal('hide');
        });

    }

    function buildConfig() {
        return {
            delimiter: "",
            header: true,
            dynamicTyping: false,
            skipEmptyLines: true,
            preview: 0,
            step: undefined,
            encoding: "",
            worker: false,
            comments: "",
            complete: completeFn,
            error: errorFn,
            download: false
        };
    }

    function buildManifestItemsConfig() {
        return {
            delimiter: "",
            header: true,
            dynamicTyping: false,
            skipEmptyLines: true,
            preview: 0,
            step: undefined,
            encoding: "",
            worker: false,
            comments: "",
            complete: completeManifestItemsFn,
            error: errorManifestItemsFn,
            download: false
        };
    }

    function uploadManifests() {
        if (typeof file == 'undefined') {
            alert('Unable to retrieve the file path');
            return false;
        }

        $("#manifestsFile").prop("disabled", true);
        disableButton();
        $('#statusDiv').show();

        var config = buildConfig();

        $('#manifestsFile').parse({
            config: config,
            before: function (file, inputElem) {
                start = now();
                console.log("Parsing file...", file);
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
                firstError = firstError || err;
                errorCount++;
            },
            complete: function () {
                end = now();
                printStats("Done with all files");
            }
        });
    }

    function uploadManifestItems() {
        if (typeof file == 'undefined') {
            alert('Unable to retrieve the file path');
            return false;
        }

        $("#manifestsFile").prop("disabled", true);
        disableButton();
        $('#statusDiv').show();

        var config = buildManifestItemsConfig();

        $('#manifestsFile').parse({
            config: config,
            before: function (file, inputElem) {
                start = now();
                console.log("Parsing file...", file);
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
                firstError = firstError || err;
                errorCount++;
            },
            complete: function () {
                end = now();
                printStats("Done with all files");
            }
        });
    }

    function completeFn(results) {

        end = now();

        if (results && results.errors) {
            if (results.errors) {
                errorCount = results.errors.length;
                firstError = results.errors[0];
            }
            if (results.data && results.data.length > 0) {
                rowCount = results.data.length;
                $('#statusDiv').html('Validating...');
                var validationResult = validateManifestData(results);
                fileResults = results;

                if (validationResult == true) {
                    $('#statusDiv').html('Uploading...');
                    uploadManifestData(results);
                }
                else {
                    $('#statusDiv').html('Fix validation issues and refresh the page to reupload...');
                }
            }
        }

        printStats("Parse complete");
        console.log("    Results:", results);

        // icky hack
        //setTimeout(enableButton, 100);
    }

    function errorFn(err, file) {
        end = now();
        console.log("ERROR:", err, file);
        //enableButton();
    }

    function completeManifestItemsFn(results) {

        end = now();

        if (results && results.errors) {
            if (results.errors) {
                errorCount = results.errors.length;
                firstError = results.errors[0];
            }
            if (results.data && results.data.length > 0) {
                rowCount = results.data.length;
                $('#statusDiv').html('Validating...');
                var validationResult = validateManifestItemsData(results);
                fileResults = results;

                if (validationResult == true) {
                    $('#statusDiv').html('Uploading...');
                    uploadManifestItemsData(results);
                }
                else {
                    $('#statusDiv').html('Fix validation issues and refresh the page to reupload...');
                }
            }
        }

        printStats("Parse complete");
        console.log("    Results:", results);

        // icky hack
        //setTimeout(enableButton, 100);
    }

    function errorManifestItemsFn(err, file) {
        end = now();
        console.log("ERROR:", err, file);
        //enableButton();
    }

    function now() {
        return typeof window.performance !== 'undefined' ? window.performance.now() : 0;
    }

    function printStats(msg) {
        if (msg) {
            console.log(msg);
        }
    }

    function enableButton() {
        $('#btnUploadManifests').prop('disabled', false);
    }

    function disableButton() {
        $('#btnUploadManifests').prop('disabled', true);
    }

    function validateManifestData(results) {

        for (index = 0; index < results.data.length; index++) {
            var item = results.data[index];

            var type = item["Category"];
            var conversionTypeOrSsn = item["Conversion Type/SSN"];
            var parcelsMergeStatus = item["Parcels/Merge Status"];

            var rowIndex = index + 1;

            if (type == 'File Info') {
                if (parcelsMergeStatus == '' || parcelsMergeStatus == null) {
                    alert("Parcels field is required, please enter valid Parcels! Row " + rowIndex);
                    return false;
                }
                else if (isNaN(parcelsMergeStatus)) {
                    alert("Parcels " + parcelsMergeStatus + " is invalid, please enter valid Parcels! Row " + rowIndex);
                    return false;
                }

                var conversionType = conversionTypeOrSsn;
            }

            if (type == 'Data') {
                if (conversionTypeOrSsn == '' || conversionTypeOrSsn == null) {
                    alert("SSN field is required, please enter valid SSN! Row " + rowIndex);
                    return false;
                }
                else if (validateSSN(conversionTypeOrSsn) == false) {
                    alert("SSN " + conversionTypeOrSsn + " is invalid, please enter valid SSN! Row " + rowIndex);
                    return false;
                }
                //else {
                //    if (validateSSNLookup(conversionTypeOrSsn.toString().replace(/-/g, '')) == false) {
                //        alert("SSN " + conversionTypeOrSsn + " not found, please enter valid SSN! Row " + rowIndex);
                //        return false;
                //    }
                //}
                else if (conversionType == "Back File" || conversionType == "Day Forward") {
                    var found = validateSSNConversionTypeSSN(conversionType, conversionTypeOrSsn);

                    if (found == false) {
                        return false;
                    }
                }
                else {
                    if (CommonModule.validateSSNLookup(conversionTypeOrSsn.replace(/-/g, ''), arrayOfSsnLookups) == false) {
                        alert("SSN " + conversionTypeOrSsn + " not found, please enter valid SSN!");
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function validateManifestItemsData(results) {

        for (index = 0; index < results.data.length; index++) {
            var item = results.data[index];

            var manifestId = item["Manifest ID"];
            var ssn = item["SSN"];
            var mergeStatus = item["Merge Status"];

            var rowIndex = index + 1;

            if (ssn == '' || ssn == null) {
                alert("SSN field is required, please enter valid SSN! Row " + rowIndex);
                return false;
            }
            else if (validateSSN(ssn) == false) {
                alert("SSN " + ssn + " is invalid, please enter valid SSN! Row " + rowIndex);
                return false;
            }
            //else {
            //    if (validateSSNLookup(conversionTypeOrSsn.toString().replace(/-/g, '')) == false) {
            //        alert("SSN " + conversionTypeOrSsn + " not found, please enter valid SSN! Row " + rowIndex);
            //        return false;
            //    }
            //}
            //else if (conversionType == "Back File" || conversionType == "Day Forward") {
            //    var found = validateSSNConversionTypeSSN(conversionType, conversionTypeOrSsn);

            //    if (found == false) {
            //        return false;
            //    }
            //}
            //else {
            if (CommonModule.validateSSNLookup(ssn.replace(/-/g, ''), arrayOfSsnLookups) == false) {
                alert("SSN " + ssn + " not found, please enter valid SSN!");
                return false;
            }
            //}
        }

        return true;
    }

    var validateSSNConversionTypeSSN = function (conversionType, ssn) {
        var ssnFound = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.title == ssn; });

        if (ssnFound.length > 0) {
            var conversionTypeFound = _.filter(arrayOfmanifests, function (manifest) { return manifest[2] == conversionType && manifest[6] == ssnFound[0].manifestid; });

            if (conversionTypeFound.length > 0) {
                if (conversionTypeFound[0][2] == "Back File") {
                    //alert('SSN found with Back File Conversion Type');
                    $("#ssnWithBackFile").modal();
                    return false;
                }
                else if (conversionTypeFound[0][2] == "Day Forward") {
                    $("#ssnWithDayForward").modal();
                    return false;
                }
            }
        }

        return true;
    }

    function uploadManifestData(results) {
        var newManifest = [];
        var newManifestItems = [];

        for (index = 0; index < results.data.length; index++) {
            var item = results.data[index];

            var type = item["Category"];
            var conversionTypeOrSsn = item["Conversion Type/SSN"];
            var parcelsMergeStatus = item["Parcels/Merge Status"];

            if (type == 'File Info') {
                var poid = item["POID"];

                if (newManifest.length > 0) {
                    saveNewManifestData(newManifest, newManifestItems)
                    newManifest = [];
                    newManifestItems = [];
                }

                newManifest = [];
                newManifest.push('');
                newManifest.push(CommonModule.getAgencyName());
                newManifest.push(conversionTypeOrSsn);
                newManifest.push(parcelsMergeStatus);
                newManifest.push(poid);
                newManifest.push('');
            }

            if (type == 'Data') {
                var newManifestItem = [];
                newManifestItem.push(conversionTypeOrSsn.toString().replace(/-/g, ''));
                newManifestItem.push(parcelsMergeStatus);
                newManifestItem.push('');
                newManifestItems.push(newManifestItem);
            }

            if (index == results.data.length - 1) {
                saveNewManifestData(newManifest, newManifestItems)
            }
        }
    }

    function uploadManifestItemsData(results) {
        var newManifestItems = [];

        for (index = 0; index < results.data.length; index++) {
            var item = results.data[index];

            var manifestId = item["Manifest ID"];
            var ssn = item["SSN"];
            var mergeStatus = item["Merge Status"];

            var newManifestItem = [];
            newManifestItem.push(ssn.toString().replace(/-/g, ''));
            newManifestItem.push(mergeStatus);
            newManifestItem.push('');
            newManifestItems.push(newManifestItem);

            if (index == results.data.length - 1) {

                var siteUrl = _spPageContextInfo.webAbsoluteUrl;
                var clientContext = new SP.ClientContext(siteUrl);
                var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');

                var manifestListItem = manifestsList.getItemById(manifestId);

                clientContext.load(manifestListItem);

                clientContext.executeQueryAsync(
                    function (sender, args) {
                        saveNewManifestItemData(manifestListItem, newManifestItems);
                    },
                    function (sender, args) {
                        alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
                    }
                );

            }
        }
    }

    var clientContext;
    var arrayOfSsnLookups;

    function validateSSN(elementValue) {
        var ssnPattern = /^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/;
        return ssnPattern.test(elementValue);
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

    //var manifestListItem;
    //var manifestItemListItemColl;
    //var manifestAttachmentBuffer;
    //var boxLabelDocumentBuffer;
    //var jsPdfObj;

    var saveNewManifestData = function (manifestData, manifestItemsData) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        if (manifestData[0] == '') {

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var manifestListItem = manifestsList.addItem(itemCreateInfo);

            var newGuid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();;
            manifestListItem.set_item('Title', manifestData[1]);
            manifestListItem.set_item('ConversionType', manifestData[2]);
            manifestListItem.set_item('Parcels', manifestData[3]);
            manifestListItem.set_item('POID', manifestData[4]);
            manifestListItem.set_item('Status', "Created");
            manifestListItem.set_item('Uploaded', true);
            manifestListItem.set_item('ManifestID', newGuid);

            manifestListItem.update();

            clientContext.load(manifestListItem);

            var jsPdfObj = [];
            jsPdfObj.push(manifestData[1]);
            jsPdfObj.push(manifestData[2]);
            jsPdfObj.push(manifestData[3]);
            jsPdfObj.push(manifestData[4]);
            jsPdfObj.push(newGuid);

            var manifestItemListItemColl = [];

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
                console.log(newManifestId);
                var newManifestItemId = manifestItemListItem.get_id();

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

                var manifestAttachmentBuffer = doc.output('arraybuffer');

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
                boxLabelRow['data'] = " Personnel Office Identified (POID) level 1234";
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                boxLabelRow['data'] = " Destiny Manifest Creator";
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
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

                var boxLabelDocumentBuffer = boxLabelDoc.output('arraybuffer');

                attachFilesToListItem("Manifests", newManifestId, manifestAttachmentBuffer, boxLabelDocumentBuffer);
                uploadFilesToDocumentLibrary(newManifestId, jsPdfObj[4], manifestAttachmentBuffer, boxLabelDocumentBuffer);

                //var reader = new FileReader();
                //reader.onload = function (e) {
                //    uploadFile(e.target.result, fileName);
                //} 

                var reader = new FileReader();
                reader.onload = function (e) {
                    var csvBuffer = reader.result;
                    uploadCsvFilesToDocumentLibrary(newManifestId, jsPdfObj[4], csvBuffer)
                }
                reader.readAsArrayBuffer(file);

                //uploadCsvFilesToDocumentLibrary(newManifestId, jsPdfObj[4], file)

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

                setTimeout(retrieveManifestsData(), 2000);

            },
            function (sender, args) {
                alert("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    var saveNewManifestItemData = function (manifestData, manifestItemsData) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);

        var manifestItemsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var jsPdfObj = [];
        jsPdfObj.push(manifestData["Title"]);
        jsPdfObj.push(manifestData["ConversionType"]);
        jsPdfObj.push(manifestData["Parcels"]);
        jsPdfObj.push(manifestData["POID"]);
        jsPdfObj.push(manifestData["ManifestID"]);

        var manifestItemListItemColl = [];

        for (var manifestItemIndex = 0; manifestItemIndex < manifestItemsData.length; manifestItemIndex++) {
            var manifestItem = manifestItemsData[manifestItemIndex];
            var newSsn = manifestItem[0];
            var newMergeStatus = manifestItem[1];

            var manifestItemCreateInfo = new SP.ListItemCreationInformation();
            var manifestItemListItem = manifestItemsList.addItem(manifestItemCreateInfo);
            manifestItemListItem.set_item('Title', newSsn);
            manifestItemListItem.set_item('MergeStatus', newMergeStatus);
            manifestItemListItem.set_item('ManifestID', manifestData["ManifestID"]);

            manifestItemListItem.update();
            manifestItemListItemColl.push(manifestItemListItem);
            clientContext.load(manifestItemListItem);

            jsPdfItemObj = [];
            jsPdfItemObj.push(newSsn);
            jsPdfItemObj.push(newMergeStatus);
            jsPdfObj.push(jsPdfItemObj);
        }

        clientContext.executeQueryAsync(
            function (sender, args) {
                var newManifestId = manifestData["ManifestID"];
                console.log(newManifestId);
                var newManifestItemId = manifestItemListItem.get_id();

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

                var manifestAttachmentBuffer = doc.output('arraybuffer');

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
                boxLabelRow['data'] = " Personnel Office Identified (POID) level 1234";
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
                boxLabelRow['data'] = " Destiny Manifest Creator";
                boxLabelRows.push(boxLabelRow);
                boxLabelRow = {};
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

                var boxLabelDocumentBuffer = boxLabelDoc.output('arraybuffer');

                attachFilesToListItem("Manifests", newManifestId, manifestAttachmentBuffer, boxLabelDocumentBuffer);
                uploadFilesToDocumentLibrary(newManifestId, jsPdfObj[4], manifestAttachmentBuffer, boxLabelDocumentBuffer);

                //var reader = new FileReader();
                //reader.onload = function (e) {
                //    uploadFile(e.target.result, fileName);
                //} 

                var reader = new FileReader();
                reader.onload = function (e) {
                    var csvBuffer = reader.result;
                    uploadCsvFilesToDocumentLibrary(newManifestId, jsPdfObj[4], csvBuffer)
                }
                reader.readAsArrayBuffer(file);

                //uploadCsvFilesToDocumentLibrary(newManifestId, jsPdfObj[4], file)

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

                setTimeout(retrieveManifestsData(), 2000);

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

    function attachFilesToListItem(listName, id, buffer, boxLabelDocumentBuffer) {

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
            async: false,
            success: function (data) {
                var url = data.d.ServerRelativeUrl;

                $("#manifestDocumentSpan").append("<a href='" + url + "' target=_blank><u>Agency Manifest</u></a>");

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
                        var url = data.d.ServerRelativeUrl;

                        $("#manifestDocumentSpan").append("&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + url + "' target=_blank><u>BOX LABEL</u></a>");
                    },
                    error: function (data) {
                        alert("Attachment Failure:" + data.status + "," + data.statusText);
                    }
                });

            },
            error: function (data) {
                alert("Attachment Failure:" + data.status + "," + data.statusText);
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
                $("#statusDiv").html('Successfully Completed!');
            },
            function (sender, args) {
                console.log("Error: " + args.get_message() + "\n" + args.get_stackTrace());
            }
        );
    }

    function uploadCsvFilesToDocumentLibrary(itemId, manifestId, csvBuffer) {

        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var csvDocsList = clientContext.get_web().get_lists().getByTitle('UploadedManifestDocuments');


        var csvBytes = new Uint8Array(csvBuffer);
        var csvIndex, csvOut = '';
        for (csvIndex = 0; csvIndex < csvBytes.length; csvIndex++) {
            csvOut += String.fromCharCode(csvBytes[csvIndex]);
        }
        var csvBase64 = btoa(csvOut);

        var csvDoc = new SP.FileCreationInformation();
        csvDoc.set_content(csvBase64);
        csvDoc.set_url("UploadedCsv" + itemId + ".csv");

        //var arr = convertDataURIToBinary(this.result);
        //for (var i = 0; i < arr.length; ++i) {
        //    fileCreateInfo.get_content().append(arr[i]);
        //}

        var uploadedCsvDoc = csvDocsList.get_rootFolder().get_files().add(csvDoc);
        var csvDocItem = uploadedCsvDoc.get_listItemAllFields();
        csvDocItem.set_item('ManifestID', manifestId);
        clientContext.load(uploadedCsvDoc);
        csvDocItem.update();
        clientContext.load(csvDocItem);

        clientContext.executeQueryAsync(
            function (sender, args) {
                console.log("Successfully uploaded documents to Manifest Docs library");
                $("#statusDiv").html('Successfully Completed!');
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

    var retrieveCurrentUserName = function () {
        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);

        var currentUser = clientContext.get_web().get_currentUser(); //must load this to access info.
        clientContext.load(currentUser);

        clientContext.executeQueryAsync(
            function (sender, args) {
                currentUserName = currentUser.get_title()
            },
            function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }
        );
    }

    var retrieveManifestsData = function () {
        console.log("Start Time: " + new Date().toLocaleString());
        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestElementsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');
        var ssnLookupList = clientContext.get_web().get_lists().getByTitle('SSNLookup');
        var uploadedCsvDocumentLibrary = clientContext.get_web().get_lists().getByTitle('UploadedManifestDocuments');

        var camlQueryManifests = new SP.CamlQuery();
        camlQueryManifests.set_viewXml('<View Scope="Recursive"><Query><Where><Eq><FieldRef Name="Uploaded"/><Value Type="Integer">1</Value></Eq></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View Scope="Recursive"><Query><Where></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        manifestsColl = manifestsList.getItems(camlQuery);
        manifestElementsColl = manifestElementsList.getItems(camlQuery);
        ssnLookupColl = ssnLookupList.getItems(camlQuery);
        //uploadedCsvDocumentsColl = uploadedCsvDocumentLibrary.getItems(camlQuery);

        clientContext.load(manifestsColl, 'Include(Title, POID, ConversionType, Parcels, ID, ManifestID, Status, Uploaded, Attachments, AttachmentFiles)');
        clientContext.load(manifestElementsColl);
        clientContext.load(ssnLookupColl);
        //clientContext.load(uploadedCsvDocumentsColl);

        var query = SP.CamlQuery.createAllItemsQuery();
        uploadedCsvDocumentsColl = uploadedCsvDocumentLibrary.getItems(query);
        clientContext.load(uploadedCsvDocumentsColl, 'Include(Title, ContentType, File, ManifestID)');

        var currentUser = clientContext.get_web().get_currentUser(); //must load this to access info.
        clientContext.load(currentUser);

        clientContext.executeQueryAsync(
            function (sender, args) {
                $("#manifestParentDiv").show();

                var uploadedCsvDocumentsEnumerator = uploadedCsvDocumentsColl.getEnumerator();

                var uploadedCsvDocumentsArray = new Array();

                while (uploadedCsvDocumentsEnumerator.moveNext()) {
                    var uploadedCsvDocument = uploadedCsvDocumentsEnumerator.get_current();

                    var contentType = uploadedCsvDocument.get_contentType();

                    if (contentType.get_name() != "Folder") {
                        var File = uploadedCsvDocument.get_file();

                        if (File != null) {
                            var fileUrl = File.get_serverRelativeUrl();
                            console.log("FielUrl: " + fileUrl);
                        }

                        var documentTitle = uploadedCsvDocument.get_item('Title');
                        var manifestID = uploadedCsvDocument.get_item('ManifestID');

                        var uploadedCsvDocument = {
                            documentTitle: documentTitle,
                            manifestID: manifestID,
                            fileUrl: fileUrl
                        }

                        uploadedCsvDocumentsArray.push(uploadedCsvDocument);
                    }
                }

                var manifestsListItemEnumerator = manifestsColl.getEnumerator();

                var manifests = new Array();
                var uploadedManifests = new Array();

                while (manifestsListItemEnumerator.moveNext()) {

                    var manifestsListItem = manifestsListItemEnumerator.get_current();
                    var title = manifestsListItem.get_item('Title');
                    var poid = manifestsListItem.get_item('POID');
                    var conversionType = manifestsListItem.get_item('ConversionType');
                    var parcels = manifestsListItem.get_item('Parcels');
                    var status = manifestsListItem.get_item('Status');
                    var id = manifestsListItem.get_item('ID');
                    var manifestid = manifestsListItem.get_item('ManifestID');
                    var uploaded = manifestsListItem.get_item('Uploaded');
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
                    manifest.push(poid);
                    manifest.push(conversionType);
                    manifest.push(parcels);
                    manifest.push(id);
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
                        agencyManifestDocumentHtml = '<a href="' + agencyManifestLink + '" target="_blank"><u>Agency Manifest</u></a>'
                    }

                    if (boxLabelLink != '') {
                        boxLabelDocumentHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + boxLabelLink + '" target="_blank"><u>Box Label</u></a>'
                    }

                    manifest.push(agencyManifestDocumentHtml);
                    manifest.push(boxLabelDocumentHtml);


                    var filteredUploadedCsvDocumentUrl = '';
                    var filteredUploadedCsvDocuments = _.filter(uploadedCsvDocumentsArray, function (uploadedCsvDocument) { return uploadedCsvDocument.manifestID == manifestid; });

                    if (filteredUploadedCsvDocuments.length > 0) {
                        filteredUploadedCsvDocumentUrl = '<a href="' + filteredUploadedCsvDocuments[0].fileUrl + '" target="_blank"><u>Uploaded File</u></a>';
                    }

                    manifest.push(filteredUploadedCsvDocumentUrl);

                    if (uploaded == true) {
                        uploadedManifests.push(manifest);
                    }

                    manifests.push(manifest);
                }

                arrayOfmanifests = manifests;

                var manifestElementsListItemEnumerator = manifestElementsColl.getEnumerator();

                arrayOfmanifestElements = new Array();

                $('#manifestsTable').DataTable({
                    data: uploadedManifests,
                    destroy: true,
                    columns: [
                        { title: "Agency", width: "10%" },
                        { title: "POID", width: "10%" },
                        { title: "Conversion Type", width: "15%" },
                        { title: "Parcels (Boxes)", width: "12%" },
                        { title: "Manifest Id", width: "10%" },
                        { title: "Status", width: "10%" },
                        { title: "Manifest Id Lookup", visible: false },
                        { title: "View", sorting: false, width: "8%", className: "text-center-align" },
                        { title: "Edit", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Delete", visible: false, sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Agency Manifest", sorting: false, width: "15%", className: "text-center-align" },
                        { title: "Box Label", sorting: false, width: "10%", className: "text-center-align" },
                        { title: "Uploaded Document", sorting: false, width: "10%", className: "text-center-align" }
                    ]
                });

                $('#manifestElementsTable').DataTable({
                    data: arrayOfmanifestElements,
                    destroy: true,
                    columns: [
                        { title: "SSN" },
                        { title: "Merge Status" },
                        { title: "Manifest Item Id" },
                        { title: "Manifest Id", visible: false }
                    ]
                });

                while (manifestElementsListItemEnumerator.moveNext()) {
                    var manifestElementsListItem = manifestElementsListItemEnumerator.get_current();
                    var title = manifestElementsListItem.get_item('Title');
                    var mergeStatus = manifestElementsListItem.get_item('MergeStatus');
                    var id = manifestElementsListItem.get_item('ID');
                    var manifestid = manifestElementsListItem.get_item('ManifestID');

                    var guidId = "guid" + id;

                    var manifestElement = {
                        title: title,
                        mergeStatus: mergeStatus,
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

                console.log("End Time: " + new Date().toLocaleString());
            },
            function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }
        );
    }

    return {
        retrieveCurrentUserName: retrieveCurrentUserName,
        initializeFileSelect: initializeFileSelect,
        uploadManifests: uploadManifests,
        uploadManifestItems: uploadManifestItems,
        saveNewManifestData: saveNewManifestData,
        initializeClickEvents: initializeClickEvents,
        retrieveManifestsData: retrieveManifestsData
    }
})();