//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace VastecOPMSP.OPMIssueFoldersWP {
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
    
    
    public partial class OPMIssueFoldersWP {
        
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebPartCodeGenerator", "15.0.0.0")]
        public static implicit operator global::System.Web.UI.TemplateControl(OPMIssueFoldersWP target) 
        {
            return target == null ? null : target.TemplateControl;
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "15.0.0.0")]
        private void @__BuildControlTree(global::VastecOPMSP.OPMIssueFoldersWP.OPMIssueFoldersWP @__ctrl) {
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

<script src=""/_layouts/15/VastecOPMSP/CreateIssueFolders.js?ver=");
                                                        @__w.Write(DateTime.Now.Ticks.ToString());

            @__w.Write("\" type=\"text/javascript\"></script>\r\n<script src=\"/_layouts/15/VastecOPMSP/Common." +
                    "js?ver=");
                                            @__w.Write(DateTime.Now.Ticks.ToString());

            @__w.Write("\" type=\"text/javascript\"></script>\r\n<link href=\"/_layouts/15/VastecOPMSP/style.cs" +
                    "s?ver=");
                                           @__w.Write(DateTime.Now.Ticks.ToString());

            @__w.Write("\" rel=\"stylesheet\" type=\"text/css\" />\r\n\r\n<style>\r\n    .popup-table-cell {\r\n      " +
                    "  width: 100%;\r\n        padding: 5px;\r\n    }\r\n</style>\r\n\r\n<div id=\"manifestParen" +
                    "tDiv\" style=\"display: none\">\r\n    <br />    \r\n    <div class=\"global-search-wrap" +
                    "per\">\r\n        Search:\r\n        <input type=\"text\" id=\"globalSearch\">\r\n        <" +
                    "button type=\"button\" class=\"btn btn-info\" id=\"btnGlobalSearch\">Search</button>\r\n" +
                    "        <button type=\"button\" class=\"btn btn-info\" id=\"btnClearGlobalSearch\">Cle" +
                    "ar Search</button>\r\n    </div>\r\n    <br />  \r\n     <div class=\"row\">\r\n        <d" +
                    "iv class=\"col-md-6\">\r\n            <h3>Create Issue Folders</h3>\r\n        </div>\r" +
                    "\n        <div class=\"col-md-6 global-search-wrapper help-text\">\r\n            <sp" +
                    "an tabindex=\"0\" class=\"wf wf-size-x18 wf-family-o365 wf-o365-question\" role=\"pre" +
                    "sentation\" style=\"font-size: 22px; vertical-align: middle; display: inline-block" +
                    "; cursor: pointer;\" id=\"helpText\" data-toggle=\"popover\" data-trigger=\"focus\"></s" +
                    "pan>\r\n        </div>\r\n    </div>\r\n    \r\n    <br />\r\n    <table class=\"manifest-e" +
                    "lements-table display dataTable cell-border compact globalSearch\" id=\"manifestEl" +
                    "ementsTable\"></table>\r\n\r\n    <div id=\"issueDescription\" class=\"modal fade\" role=" +
                    "\"dialog\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-con" +
                    "tent\">\r\n                <div class=\"modal-header\">\r\n                    <button " +
                    "type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n             " +
                    "       <h4 class=\"modal-title\" id=\"popupTitle\">Issue Description</h4>\r\n         " +
                    "       </div>\r\n                <div class=\"modal-body\">\r\n                    <ta" +
                    "ble id=\"manifestItemDetailsInPopup\">\r\n                        <tr>\r\n            " +
                    "                <td class=\"popup-table-cell\">Issue Description: <br />(Please pr" +
                    "ovide additional information why it is an issue.) </td>\r\n                       " +
                    " </tr>\r\n                        <tr>\r\n                            <td class=\"pop" +
                    "up-table-cell\">\r\n                                <textarea id=\"issueDescriptionT" +
                    "ext\" style=\"width:100%\" rows=\"10\"></textarea>\r\n                            </td>" +
                    "\r\n                            <td class=\"popup-table-cell\">\r\n                   " +
                    "            <div id=\"issueDescriptionTextPrev\" style=\"display: none\" ></div>\r\n  " +
                    "                              <input type=\"text\" id=\"markAsIssue\" style=\"display" +
                    ": none\" />\r\n                                <input type=\"text\" id=\"manifestItemI" +
                    "d\" style=\"display: none\" />\r\n                            </td>\r\n                " +
                    "        </tr>\r\n                    </table>                                     " +
                    "  \r\n                </div>\r\n                <div class=\"modal-footer\">\r\n        " +
                    "            <button type=\"button\" class=\"btn btn-default btn-info\" id=\"saveIssue" +
                    "Description\">Create Issue</button>\r\n                    <button type=\"button\" cl" +
                    "ass=\"btn btn-default btn-info\" data-dismiss=\"modal\">Close</button>\r\n            " +
                    "    </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>");
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
