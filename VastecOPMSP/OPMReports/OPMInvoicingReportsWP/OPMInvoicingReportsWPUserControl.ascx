<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OPMInvoicingReportsWPUserControl.ascx.cs" Inherits="VastecOPMSP.OPMReports.OPMInvoicingReportsWP.OPMInvoicingReportsWPUserControl" %>

<script src="/_layouts/15/Common/scripts/js/jquery.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jquery-ui.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/popper.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/bootstrap.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/underscore.js"></script>
<script src="/_layouts/15/Common/scripts/js/jquery.validate.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jquery.dataTables.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.plugin.autotable.min.js"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.autotable.standard_fonts_metrics.js" type="text/javascript"></script>
<script src="/_layouts/15/Common/scripts/js/jspdf.autotable.split_text_to_size.js" type="text/javascript"></script>
<script src="/_layouts/15/Common/scripts/js/jquery.cookie.js"></script>
<link href="/_layouts/15/Common/styles/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="/_layouts/15/Common/styles/css/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="/_layouts/15/Common/styles/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />

<script src="/_layouts/15/VastecOPMSP/Common.js?ver=<%=DateTime.Now.Ticks.ToString()%>" type="text/javascript"></script>
<script src="/_layouts/15/VastecOPMSP/InvoicingReports.js?ver=<%=DateTime.Now.Ticks.ToString()%>" type="text/javascript"></script>
<link href="/_layouts/15/VastecOPMSP/style.css?ver=<%=DateTime.Now.Ticks.ToString()%>" rel="stylesheet" type="text/css" />

<%--<script src="/_layouts/15/VastecOPMSP/Common.js" type="text/javascript"></script>
<script src="/_layouts/15/VastecOPMSP/InvoicingReports.js" type="text/javascript"></script>
<link href="/_layouts/15/VastecOPMSP/style.css" rel="stylesheet" type="text/css" />--%>

<div id="manifestParentDiv" style="display: none">
    <br />
    <div class="row">
        <div class="col-md-6">
            <%--<h3>Manifests Report</h3>--%>
        </div>
        <div class="col-md-6 global-search-wrapper">
            <span tabindex="0" class="wf wf-size-x18 wf-family-o365 wf-o365-question" role="presentation" style="font-size: 22px; vertical-align: middle; display: inline-block; cursor: pointer;" id="helpText" data-toggle="popover" data-trigger="focus"></span>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Office Identifier:
        </div>
        <div class="col-md-2">
            Report Start Date:
        </div>
        <div class="col-md-2">
            Report End Date:
        </div>
        <div class="col-md-6">
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            <select id="officeIdentifier">
                <option value="Default">Default</option>
                <option value="Default 2">Default 2</option>
                <option value="Default 3">Default 3</option>
            </select>
        </div>
        <div class="col-md-2">
            <input type="date" id="reportStartDate">
        </div>
        <div class="col-md-2">
            <input type="date" id="reportEndDate">
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-info" id="btnSearch">Run Report</button>
        </div>
        <div class="col-md-4">
        </div>
    </div>

    <br />
    <table class="manifest-table display dataTable cell-border compact globalSearch" id="manifestsTable"></table>
</div>