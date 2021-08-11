$().ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadEmployeeData);

    function LoadEmployeeData() {
        CommonModule.retrieveConfigurations();
        ManifestsModule.initializeTreeView();
        ManifestsModule.retrieveManifestsData();
    }
});

var ManifestsModule = (function () {

    var initializeTreeView = function () {
        var toggler = document.getElementsByClassName("caret");
        var i;

        for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function () {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        }
    }

    var retrieveManifestsData = function () {
        console.log("Start Time: " + new Date().toLocaleString());
        var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        clientContext = new SP.ClientContext(siteUrl);
        var manifestsList = clientContext.get_web().get_lists().getByTitle('Manifests');
        var manifestElementsList = clientContext.get_web().get_lists().getByTitle('ManifestItems');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View Scope="Recursive"><Query><Where></Where><OrderBy><FieldRef Name="Modified" Ascending="False"/></OrderBy></Query></View>');

        manifestsColl = manifestsList.getItems(camlQuery);
        manifestElementsColl = manifestElementsList.getItems(camlQuery);

        clientContext.load(manifestsColl);
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
                    var id = manifestsListItem.get_item('ID');
                    var manifestid = manifestsListItem.get_item('ManifestID');
                    var status = manifestsListItem.get_item('Status');

                    var manifest = [];
                    manifest.push(title);
                    manifest.push(conversionType);
                    manifest.push(parcels);
                    manifest.push(id);
                    manifest.push(manifestid);
                    manifest.push(status);

                    manifests.push(manifest);
                }

                var manifestElementsListItemEnumerator = manifestElementsColl.getEnumerator();

                var arrayOfmanifestElements = new Array();

                while (manifestElementsListItemEnumerator.moveNext()) {
                    var manifestElementsListItem = manifestElementsListItemEnumerator.get_current();
                    var title = manifestElementsListItem.get_item('Title');
                    var mergeStatus = manifestElementsListItem.get_item('MergeStatus');
                    var id = manifestElementsListItem.get_item('ID');
                    var manifestid = manifestElementsListItem.get_item('ManifestID');
                    var requestPriority = manifestElementsListItem.get_item('RequestPriority');
                    var markAsIssue = manifestElementsListItem.get_item('MarkAsIssue');

                    var manifestElement = {
                        title: title,
                        mergeStatus: mergeStatus,
                        id: id,
                        manifestid: manifestid,
                        requestPriority: requestPriority,
                        markAsIssue: markAsIssue
                    }

                    arrayOfmanifestElements.push(manifestElement);
                }

                for (var manifestIndex = 0; manifestIndex < manifests.length; manifestIndex++) {
                    var spManifestID = manifests[manifestIndex][3];
                    var manifestID = manifests[manifestIndex][4];
                    var status = manifests[manifestIndex][5];

                    var listItem = document.createElement("li");

                    var html = "Manifest: ID #" + spManifestID + " (" + manifestID + "), Status='" + status + "'";
                    listItem.append(html);

                    var filteredManifestElements = _.filter(arrayOfmanifestElements, function (manifestElement) { return manifestElement.manifestid == manifestID; });

                    var subUnorderedListItem = document.createElement("ul");

                    for (index = 0; index < filteredManifestElements.length; index++) {

                        var manifestElement = [];
                        var ssn = filteredManifestElements[index].title;
                        var mergeStatus = filteredManifestElements[index].mergeStatus;
                        var requestPriority = filteredManifestElements[index].requestPriority;
                        var spManifestItemID = filteredManifestElements[index].id;
                        var manifestItemID = filteredManifestElements[index].manifestid;
                        var markAsIssue = filteredManifestElements[index].markAsIssue;

                        
                        var subListItem = document.createElement("li");
                        subListItem.append("Manifest Item: ID #" + spManifestItemID + " (" + manifestItemID + "), SSN='" + ssn + "', RequestPrioriy='" + requestPriority + "', MarkAsIssue='" + markAsIssue + "'");

                        subUnorderedListItem.appendChild(subListItem);
                    }
                    
                    listItem.appendChild(subUnorderedListItem);
                    $("#manifestsTreeView").append(listItem);
                }

                console.log("End Time: " + new Date().toLocaleString());
            },
            function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }
        );
    }

    return {
        initializeTreeView: initializeTreeView,
        retrieveManifestsData: retrieveManifestsData
    }
})();