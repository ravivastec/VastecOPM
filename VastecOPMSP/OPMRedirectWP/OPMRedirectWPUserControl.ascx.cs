using Microsoft.Office.Server.UserProfiles;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

namespace VastecOPMSP.OPMRedirectWP
{
    public partial class OPMRedirectWPUserControl : UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string CurUserAcct = string.Empty;
            if (SPContext.Current != null)
            {
                 CurUserAcct = SPContext.Current.Web.CurrentUser.LoginName.Split('\\')[1].ToString();
            }
            //string accountName = string.Format(@"{0}\{1}", Environment.UserDomainName, Environment.UserName);
            SPSecurity.RunWithElevatedPrivileges(delegate ()
            {
                string coreProperty = "Agency"; //for dev
                //string coreProperty = "msDS-cloudExtensionAttribute1"; //for prod

                string AgencyProperty = string.Empty;
                string Url = string.Empty;
                string Info = string.Empty;

                using (SPSite Site = new SPSite(SPContext.Current.Site.ID))
                {
                    try
                    {
                        SPServiceContext spServiceContext = SPServiceContext.GetContext(Site);

                        UserProfile userProfile = null;
                        UserProfileManager profileManager = new UserProfileManager(spServiceContext);

                        //if (!string.IsNullOrEmpty(accountName))
                        //    userProfile = profileManager.GetUserProfile(accountName);
                        ////else if (SPContext.Current != null)
                        ////    userProfile = profileManager.GetUserProfile(SPContext.Current.Web.CurrentUser.RawSid);
                        //else
                        //    userProfile = profileManager.GetUserProfile(string.Format(@"{0}\{1}", Environment.UserDomainName, Environment.UserName));
                        userProfile = profileManager.GetUserProfile(string.Format(@"{0}\{1}", Environment.UserDomainName, CurUserAcct));
                        if (userProfile == null)
                            return;
                        string UserAcct = string.Format(@"{0}\{1}", Environment.UserDomainName, Environment.UserName);////
                        UserProfileConfigManager config = new UserProfileConfigManager(spServiceContext);
                        ProfilePropertyManager profilePropertyManager = config.ProfilePropertyManager;

                        CorePropertyManager corePropertyManager = profilePropertyManager.GetCoreProperties();

                        if (userProfile.Properties.GetPropertyByName(coreProperty) != null)
                        {
                            AgencyProperty = userProfile[coreProperty].Value.ToString();
                        }
                        if (!string.IsNullOrEmpty(AgencyProperty) && AgencyProperty.ToLower() != "all")
                        {
                            //Url = string.Format("http://{0}.devopm.com", AgencyProperty.ToLower());
                            Url = string.Format("https://{0}.vastecdms.com", AgencyProperty.ToLower());
                            //Response.Redirect(Url);
                            SPUtility.Redirect(Url, SPRedirectFlags.DoNotEndResponse | SPRedirectFlags.Trusted, HttpContext.Current);
                        }
                        //Info = string.Format("{0}:{1}:{2}:{3}", UserAcct, coreProperty, AgencyProperty, Url);

                        //foreach (CoreProperty coreProperty in corePropertyManager.PropertiesWithSection)
                        //{
                        //    if (userProfile.Properties.GetPropertyByName(coreProperty.Name) != null)
                        //        Console.WriteLine(string.Format("{0} : {1}",coreProperty.Name,userProfile[coreProperty.Name].Value));
                        //}
                    }
                    catch (Exception Ex)
                    {
                        lblMessage.Text = string.Format("Error: {0} - StackTrace: {1}", Ex.Message, Ex.StackTrace);
                    }
                }
            });
        }
    }
}
