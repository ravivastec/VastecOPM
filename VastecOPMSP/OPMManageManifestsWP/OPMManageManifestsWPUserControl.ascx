<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OPMManageManifestsWPUserControl.ascx.cs" Inherits="VastecOPMSP.OPMManageManifestsWP.OPMManageManifestsWPUserControl" %>

<script src="/_layouts/15/Common/scripts/js/jquery.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jquery-ui.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/bootstrap.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/underscore.js"></script>
<script src="/_layouts/15/Common/scripts/js/jquery.validate.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jquery.dataTables.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.plugin.autotable.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.autotable.standard_fonts_metrics.js" type="text/javascript"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.autotable.split_text_to_size.js" type="text/javascript"></script>
<script src="/_layouts/15/Common/scripts/js/print.min.js"></script>
<link href="/_layouts/15/Common/styles/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="/_layouts/15/Common/styles/css/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="/_layouts/15/Common/styles/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />

<script src="/_layouts/15/VastecOPMSP/Common.js?ver=<%=DateTime.Now.Ticks.ToString()%>" type="text/javascript"></script>
<script src="/_layouts/15/VastecOPMSP/ManageManifests.js?ver=<%=DateTime.Now.Ticks.ToString()%>" type="text/javascript"></script>
<link href="/_layouts/15/VastecOPMSP/style.css?ver=<%=DateTime.Now.Ticks.ToString()%>" rel="stylesheet" type="text/css" />

<div id="manifestParentDiv" style="display: none">
    <br />
    <div class="create-new-manifest-wrapper">
        <%--<button type="button" class="btn btn-info" data-toggle="modal" data-target="#createNewManifest" id="createNewManifestButton">Create New Manifest</button>--%>
    </div>
    <div class="global-search-wrapper">
        Search:
        <input type="text" id="globalSearch">
        <button type="button" class="btn btn-info" id="btnGlobalSearch">Search</button>
        <button type="button" class="btn btn-info" id="btnClearGlobalSearch">Clear Search</button>
    </div>
    <br />
    <div class="row">
        <div class="col-md-6">
            <h3>Manage Manifests</h3>
        </div>
        <div class="col-md-6 global-search-wrapper help-text">
            <span tabindex="0" class="wf wf-size-x18 wf-family-o365 wf-o365-question" role="presentation" style="font-size: 22px; vertical-align: middle; display: inline-block; cursor: pointer;" id="helpText" data-toggle="popover" data-trigger="focus"></span>
        </div>
    </div>
    <%--<h3>Manage Manifests <span class="wf wf-size-x18 wf-family-o365 wf-o365-question" role="presentation" style="font-size: 22px; vertical-align: middle; display: inline-block; cursor:pointer;" id="helpText" data-toggle="popover" data-trigger="focus"></span></h3>--%>
    <br />
    <table class="manifest-table display dataTable cell-border compact globalSearch" id="manifestsTable"></table>
    <br />
    <br />
    <h3>Manifest Items</h3>
    <br />
    <table class="manifest-elements-table display dataTable cell-border compact globalSearch" id="manifestElementsTable"></table>

    <div id="createNewManifest" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title" id="popupTitle">Agency: Default</h4>
                </div>
                <div class="modal-body">
                    <table id="manifestDetailsInPopup">
                        <tr>
                            <td class="popup-table-cell">POID: </td>
                            <td class="popup-table-cell">Conversion Type:</td>
                            <%--<td class="popup-table-cell">Parcels (Boxes):</td>
                            <td class="popup-table-cell">Status:</td>--%>
                        </tr>
                        <tr>
                            <td class="popup-table-cell">
                                <select id="newPOID">
                                    <option value="Default">Default</option>
                                    <option value="Default 2">Default 2</option>
                                    <option value="Default 3">Default 3</option>
                                </select>
                            </td>
                            <td class="popup-table-cell">
                                <select id="newConversionType">
                                    <option value="Back File">Back File</option>
                                    <option value="Day Forward">Day Forward</option>
                                </select>
                                <input type="text" id="spId" style="display: none" />
                                <input type="text" id="manifestId" style="display: none" />
                            </td>
                            <%--<td class="popup-table-cell">
                                <input type="text" id="newParcel" name="parcel" onkeypress="javascript:return ManifestsModule.isNumber(event)" />                                
                            </td>
                            <td class="popup-table-cell">
                                <select id="newStatus">
                                    <option value="Default">Created</option>
                                    <option value="Status 2">Status 2</option>
                                    <option value="Status 3">Status 3</option>
                                </select>
                            </td>--%>
                        </tr>
                    </table>
                    <br />
                    <br />
                    <%--<input id="addNewManifestElement" type="button" class="btn btn-default btn-info" value="Add new Manifest Item" />--%>
                    <table class="manifest-elements-table display dataTable cell-border compact" id="manifestElementsTableNew">
                        <thead>
                            <tr>
                                <%--<th>Title</th>--%>
                                <th>SSN</th>
                                <th>Merge Status</th>
                                <th>Reconciliation Status</th>
                                <th>Delete</th>
                                <th>Id</th>
                                <th>SSN Searchable</th>
                            </tr>
                        </thead>
                    </table>
                    <%--<br />
                    <button type="button" class="btn btn-default btn-info" id="addNewManifestElement">Create new Manifest Item</button>--%>
                    <br />
                    <br />
                    <div id="manifestDocumentSpan"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-info" id="saveNewManifest">Save</button>
                    <button type="button" class="btn btn-default btn-info" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>


    <div id="manifestItemsDuplicateCheck" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Duplicate Manifest Items</h4>
                </div>
                <div class="modal-body">
                    Found duplicate Manifest Items. 
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-info" id="createDuplicates">Create Duplicate</button>
                    <button type="button" class="btn btn-default btn-info" id="overrideCurrentManifestItem">Override Current Item</button>
                    <button type="button" class="btn btn-default btn-info" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div id="manifestItemsMasterListCheck" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Manifest Items</h4>
                </div>
                <div class="modal-body">
                    Following Manifest Items are not found in Master List. Do you still want to continue?

                    <table class="manifest-elements-table display dataTable cell-border compact" id="manifestItemsNotInMasterList">
                        <thead>
                            <tr>
                                <th>SSN</th>                                
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-info" id="manifestItemsMasterListContinue">OK</button>                    
                    <button type="button" class="btn btn-default btn-info" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>
