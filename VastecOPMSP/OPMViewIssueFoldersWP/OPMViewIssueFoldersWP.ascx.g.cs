﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace VastecOPMSP.OPMViewIssueFoldersWP {
    using System.Web.UI.WebControls.Expressions;
    using System.Web.UI.HtmlControls;
    using System.Collections;
    using System.Text;
    using System.Web.UI;
    using System.Collections.Generic;
    using System.Linq;
    using System.Xml.Linq;
    using Microsoft.SharePoint.WebPartPages;
    using System.Web.SessionState;
    using System.Configuration;
    using Microsoft.SharePoint;
    using System.Web;
    using System.Web.DynamicData;
    using System.Web.Caching;
    using System.Web.Profile;
    using System.ComponentModel.DataAnnotations;
    using System.Web.UI.WebControls;
    using System.Web.Security;
    using System;
    using Microsoft.SharePoint.Utilities;
    using System.Text.RegularExpressions;
    using System.Collections.Specialized;
    using System.Web.UI.WebControls.WebParts;
    using Microsoft.SharePoint.WebControls;
    using System.CodeDom.Compiler;
    
    
    public partial class OPMViewIssueFoldersWP {
        
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebPartCodeGenerator", "15.0.0.0")]
        public static implicit operator global::System.Web.UI.TemplateControl(OPMViewIssueFoldersWP target) 
        {
            return target == null ? null : target.TemplateControl;
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "15.0.0.0")]
        private void @__BuildControlTree(global::VastecOPMSP.OPMViewIssueFoldersWP.OPMViewIssueFoldersWP @__ctrl) {
            @__ctrl.SetRenderMethodDelegate(new System.Web.UI.RenderMethod(this.@__Render__control1));
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "15.0.0.0")]
        private void @__Render__control1(System.Web.UI.HtmlTextWriter @__w, System.Web.UI.Control parameterContainer) {
            @__w.Write(@"

<script src=""/_layouts/15/Common/scripts/js/jquery.min.js""></script>
<script src=""/_layouts/15/Common/scripts/js/jquery-ui.min.js""></script>
<script src=""/_layouts/15/Common/scripts/js/bootstrap.min.js""></script>
<script src=""/_layouts/15/Common/scripts/js/underscore.js""></script>
<script src=""/_layouts/15/Common/scripts/js/jquery.validate.min.js""></script>
<script src=""/_layouts/15/Common/scripts/js/jquery.dataTables.min.js""></script>
<script src=""/_layouts/15/Common/scripts/js/jspdf.min.js""></script>
<script src=""/_layouts/15/Common/scripts/js/jspdf.plugin.autotable.min.js""></script>
<script src=""/_layouts/15/Common/scripts/js/jspdf.autotable.standard_fonts_metrics.js"" type=""text/javascript""></script>
<script src=""/_layouts/15/Common/scripts/js/jspdf.autotable.split_text_to_size.js"" type=""text/javascript""></script>
<link href=""/_layouts/15/Common/styles/css/bootstrap.min.css"" rel=""stylesheet"" type=""text/css"" />
<link href=""/_layouts/15/Common/styles/css/jquery-ui.css"" rel=""stylesheet"" type=""text/css"" />
<link href=""/_layouts/15/Common/styles/css/jquery.dataTables.min.css"" rel=""stylesheet"" type=""text/css"" />

<script src=""/_layouts/15/VastecOPMSP/ViewIssueFolders.js?ver=");
                                                      @__w.Write(DateTime.Now.Ticks.ToString());

            @__w.Write("\" type=\"text/javascript\"></script>\r\n<script src=\"/_layouts/15/VastecOPMSP/Common." +
                    "js?ver=");
                                            @__w.Write(DateTime.Now.Ticks.ToString());

            @__w.Write("\" type=\"text/javascript\"></script>\r\n<link href=\"/_layouts/15/VastecOPMSP/style.cs" +
                    "s?ver=");
                                           @__w.Write(DateTime.Now.Ticks.ToString());

            @__w.Write("\" rel=\"stylesheet\" type=\"text/css\" />\r\n\r\n<style>\r\n    .popup-table-cell {\r\n      " +
                    "  width: 100%;\r\n        padding: 5px;\r\n    }\r\n</style>\r\n\r\n<div id=\"manifestParen" +
                    "tDiv\" style=\"display: none\">\r\n    <br />\r\n    <div class=\"global-search-wrapper\"" +
                    ">\r\n        Search:\r\n        <input type=\"text\" id=\"globalSearch\">\r\n        <butt" +
                    "on type=\"button\" class=\"btn btn-info\" id=\"btnGlobalSearch\">Search</button>\r\n    " +
                    "    <button type=\"button\" class=\"btn btn-info\" id=\"btnClearGlobalSearch\">Clear S" +
                    "earch</button>\r\n    </div>\r\n    <br />\r\n     <div class=\"row\">\r\n        <div cla" +
                    "ss=\"col-md-6\">\r\n            <h3>View Issue Folders</h3>\r\n        </div>\r\n       " +
                    " <div class=\"col-md-6 global-search-wrapper help-text\">\r\n            <span tabin" +
                    "dex=\"0\" class=\"wf wf-size-x18 wf-family-o365 wf-o365-question\" role=\"presentatio" +
                    "n\" style=\"font-size: 22px; vertical-align: middle; display: inline-block; cursor" +
                    ": pointer;\" id=\"helpText\" data-toggle=\"popover\" data-trigger=\"focus\"></span>\r\n  " +
                    "      </div>\r\n    </div>\r\n    \r\n    <br />\r\n    <table class=\"manifest-elements-" +
                    "table display dataTable cell-border compact globalSearch\" id=\"manifestElementsTa" +
                    "ble\"></table>\r\n\r\n    <div id=\"issueDescription\" class=\"modal fade\" role=\"dialog\"" +
                    ">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n" +
                    "                <div class=\"modal-header\">\r\n                    <button type=\"bu" +
                    "tton\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <" +
                    "h4 class=\"modal-title\" id=\"popupTitle\">Issue Description</h4>\r\n                <" +
                    "/div>\r\n                <div class=\"modal-body\">\r\n                    <table id=\"" +
                    "manifestItemDetailsInPopup\">\r\n                        <tr>\r\n                    " +
                    "        <td class=\"popup-table-cell\">Issue Description: </td>\r\n                 " +
                    "       </tr>\r\n                        <tr>\r\n                            <td clas" +
                    "s=\"popup-table-cell\">\r\n                                <textarea id=\"issueDescri" +
                    "ptionText\" style=\"width: 100%\" rows=\"10\"></textarea>\r\n                          " +
                    "  </td>\r\n                            <td class=\"popup-table-cell\">\r\n            " +
                    "                    <div id=\"issueDescriptionTextPrev\" style=\"display: none\"></d" +
                    "iv>\r\n                                <input type=\"text\" id=\"markAsIssue\" style=\"" +
                    "display: none\" />\r\n                                <input type=\"text\" id=\"manife" +
                    "stItemId\" style=\"display: none\" />\r\n                            </td>\r\n         " +
                    "               </tr>\r\n                    </table>\r\n                </div>\r\n    " +
                    "            <div class=\"modal-footer\">\r\n                    <button type=\"button" +
                    "\" class=\"btn btn-default btn-info\" id=\"saveIssueDescription\">Save</button>\r\n    " +
                    "                <button type=\"button\" class=\"btn btn-default btn-info\" data-dism" +
                    "iss=\"modal\">Close</button>\r\n                </div>\r\n            </div>\r\n        " +
                    "</div>\r\n    </div>\r\n</div>\r\n");
        }
        
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "15.0.0.0")]
        private void InitializeControl() {
            this.@__BuildControlTree(this);
            this.Load += new global::System.EventHandler(this.Page_Load);
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "15.0.0.0")]
        protected virtual object Eval(string expression) {
            return global::System.Web.UI.DataBinder.Eval(this.Page.GetDataItem(), expression);
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "15.0.0.0")]
        protected virtual string Eval(string expression, string format) {
            return global::System.Web.UI.DataBinder.Eval(this.Page.GetDataItem(), expression, format);
        }
    }
}