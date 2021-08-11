<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OPMViewPriorityRequestsWP.ascx.cs" Inherits="VastecOPMSP.OPMViewPriorityRequestsWP.OPMViewPriorityRequestsWP" %>

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
<link href="/_layouts/15/Common/styles/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="/_layouts/15/Common/styles/css/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="/_layouts/15/Common/styles/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />

<script src="/_layouts/15/VastecOPMSP/ViewPriorityRequests.js?ver=<%=DateTime.Now.Ticks.ToString()%>" type="text/javascript"></script>
<script src="/_layouts/15/VastecOPMSP/Common.js?ver=<%=DateTime.Now.Ticks.ToString()%>" type="text/javascript"></script>
<link href="/_layouts/15/VastecOPMSP/style.css?ver=<%=DateTime.Now.Ticks.ToString()%>" rel="stylesheet" type="text/css" />

<style>
    .popup-table-cell {
        width: 100%;
        padding: 5px;
    }
</style>

<div id="manifestParentDiv" style="display: none">
    <br />    
    <div class="global-search-wrapper">
        Search:
        <input type="text" id="globalSearch">
        <button type="button" class="btn btn-info" id="btnGlobalSearch">Search</button>
        <button type="button" class="btn btn-info" id="btnClearGlobalSearch">Clear Search</button>
    </div>
    <br />    
     <div class="row">
        <div class="col-md-6">
            <h3>View Priority Requests</h3>
        </div>
        <div class="col-md-6 global-search-wrapper help-text">
            <span tabindex="0" class="wf wf-size-x18 wf-family-o365 wf-o365-question" role="presentation" style="font-size: 22px; vertical-align: middle; display: inline-block; cursor: pointer;" id="helpText" data-toggle="popover" data-trigger="focus"></span>
        </div>
    </div>
    <%--<h3>View Priority Requests <span class="wf wf-size-x18 wf-family-o365 wf-o365-question" role="presentation" style="font-size: 22px; vertical-align: middle; display: inline-block; cursor:pointer;" id="helpText" data-toggle="popover" data-trigger="focus"></span></h3>--%>
    <br />
    <table class="manifest-elements-table display dataTable cell-border compact globalSearch" id="manifestElementsTable"></table>    
</div>