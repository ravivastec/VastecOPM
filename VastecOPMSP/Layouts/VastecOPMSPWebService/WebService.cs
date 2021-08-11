using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using System.Xml;
using System.Xml.Serialization;
using VastecOPMSP.FHSvc;
using VastecOPMSP.Helpers;
using Microsoft.Office.Server.UserProfiles;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;

namespace VastecOPMSP.Layouts.VastecOPMSPWebService
{
    [ScriptService]
    public class WebService : System.Web.Services.WebService
    {
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Test(string message)
        {
            var responseObject = new
            {
                message = "Hello !!!" + message
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CreateManifests(Manifests manifest, List<ManifestItems> manifestItems)
        {
            long result = 0;

            BoxManifestWithItems boxManifestWithItems = new BoxManifestWithItems();

            boxManifestWithItems.BoxManifest = new BoxManifest
            {
                // TODO: BoxId 
                //BoxId = null,
                BoxLabelPrintDate = DateTime.Now,
                BoxStatus = "Created",
                ConversionType = manifest.ConversionType,
                NumberParcels = manifest.Parcels,
                ShipmentType = "Pickup",
                SpManifestId = manifest.SPManifestId,
                ProjectOfficeIdentifierId = manifest.ProjectOfficeIdentifierId
            };

            boxManifestWithItems.BoxManifestItemsList = new BoxManifestItemList();

            foreach (ManifestItems manifestItem in manifestItems)
            {
                boxManifestWithItems.BoxManifestItemsList.Add(new BoxManifestItem
                {
                    AddedToBoxDate = DateTime.Now,
                    IsMerge = manifestItem.MergeStatus == "Yes" ? true : false,
                    SpManifestItemId = manifestItem.SPManifestId,
                    Ssn = manifestItem.SSN,
                    Status = "Created"
                });
            }

            //var remoteAddress = new System.ServiceModel.EndpointAddress("http://vas-doe-mysql01:8733/flowhub/service");

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                long changeUserId = GetChangeUserId();

                //ProjectList projectList = flowHubClient.ProjectGetList(null, null, "Default");
                //boxManifestWithItems.boxManifest.ProjectId = projectList.FirstOrDefault().ProjectId;

                var serializedboxManifestWithItems = boxManifestWithItems.SerializeToXmlString();
                var insertResult = flowHubClient.BoxManifestInsertWithItems(serializedboxManifestWithItems, changeUserId);
            }

            var responseObject = new
            {
                Result = result
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateManifests(Manifests manifest, List<ManifestItems> manifestItems)
        {
            BoxManifestWithItems boxManifestWithItems = new BoxManifestWithItems();

            boxManifestWithItems.BoxManifestItemsList = new BoxManifestItemList();

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                long changeUserId = GetChangeUserId();

                BoxManifestList boxManifestList = flowHubClient.BoxManifestGetList(null, null, null, manifest.SPManifestId, manifest.Status);

                if (boxManifestList.Count > 0)
                {
                    BoxManifest boxManifest = boxManifestList.FirstOrDefault();

                    //ProjectList projectList = flowHubClient.ProjectGetList(null, null, "Default");

                    flowHubClient.BoxManifestUpdate(boxManifest.BoxManifestId, manifest.ProjectOfficeIdentifierId, null,
                                                    manifest.SPManifestId, changeUserId, null,
                                                    manifest.ConversionType, "Pickup", manifest.Parcels,
                                                    manifest.Status, null, null);

                    foreach (ManifestItems manifestItem in manifestItems)
                    {
                        BoxManifestItemList boxManifestItemList = flowHubClient.BoxManifestItemGetList(null, null, null, manifestItem.SPManifestId, manifest.Status, manifestItem.SSN);

                        if (boxManifestItemList.Count > 0)
                        {
                            BoxManifestItem boxManifestItem = boxManifestItemList.FirstOrDefault();

                            flowHubClient.BoxManifestItemUpdate(boxManifestItem.BoxManifestItemId, boxManifestItem.BoxManifestId, null,
                                                                manifestItem.SPManifestId, changeUserId, null, null, null, null,
                                                                manifestItem.MergeStatus == "Yes" ? true : false, manifest.Status, manifestItem.SSN);
                        }
                        else
                        {
                            flowHubClient.BoxManifestItemInsert(boxManifest.BoxManifestId, null, manifestItem.SPManifestId, changeUserId,
                                                                DateTime.Now, manifestItem.MergeStatus == "Yes" ? true : false, manifest.Status, manifestItem.SSN);
                        }
                    }
                }
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteManifestItem(long manifestItemId, string ssn, string status)
        {
            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                long changeUserId = GetChangeUserId();

                BoxManifestItemList boxManifestItemList = flowHubClient.BoxManifestItemGetList(null, null, null, manifestItemId, status, ssn);

                if (boxManifestItemList.Count > 0)
                {
                    BoxManifestItem boxManifestItem = boxManifestItemList.FirstOrDefault();

                    flowHubClient.BoxManifestItemDelete(boxManifestItem.BoxManifestItemId);
                }
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string MakeManitestItemPriority(string agencyName, long spBoxManifestId)
        {
            string result;

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                result = flowHubClient.MakeManifestItemPriority(agencyName, spBoxManifestId);
            }

            var responseObject = new
            {
                Result = result
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string MakeManitestItemIssue(string agencyName, long spBoxManifestId)
        {
            string result;

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                result = flowHubClient.MakeManifestItemIssue(agencyName, spBoxManifestId);
            }

            var responseObject = new
            {
                Result = result
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetPOIDs(string agencyName)
        {
            List<POID> result = new List<POID>();

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                ProjectList projectList = flowHubClient.ProjectGetList(null, null, agencyName);

                Project project = projectList.FirstOrDefault();

                if (project != null)
                {
                    ProjectOfficeIdentifierList projectOfficeIdentifierList = flowHubClient.ProjectOfficeIdentifierGetList(null, project.ProjectId, null, project.ProjectActive);
                    //ProjectOfficeIdentifierList projectOfficeIdentifierList = flowHubClient.ProjectOfficeIdentifierGetList(null, null, null, null);

                    foreach (var projectOfficeIdentifier in projectOfficeIdentifierList)
                    {
                        POID poid = new POID();
                        poid.ProjectOfficeIdentifierId = projectOfficeIdentifier.ProjectOfficeIdentifierId;
                        poid.StreetAddress = projectOfficeIdentifier.StreetAddress;
                        poid.OfficeIdentifier = projectOfficeIdentifier.OfficeIdentifier;

                        result.Add(poid);
                    }
                }
            }

            var responseObject = new
            {
                Result = result
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetProcessingTotalsList(ProcessingTotals processingTotals)
        {
            DataViewProcessingTotals[] dataViewProcessingTotals;

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                ProjectList projectList = flowHubClient.ProjectGetList(null, null, processingTotals.AgencyName);

                Project project = projectList.FirstOrDefault();

                dataViewProcessingTotals = flowHubClient.GetProcessingTotalsList(processingTotals.CustomerId,
                    project.ProjectId,
                    processingTotals.OfficeIdentifier,
                    processingTotals.ReportStartDate,
                    processingTotals.ReportEndDate);
            }

            var responseObject = new
            {
                Result = dataViewProcessingTotals
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetWeeklyProcessingTotalsList(ProcessingTotals processingTotals)
        {
            DataViewProcessingTotals[] dataViewProcessingTotals;

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                ProjectList projectList = flowHubClient.ProjectGetList(null, null, processingTotals.AgencyName);

                Project project = projectList.FirstOrDefault();

                dataViewProcessingTotals = flowHubClient.GetProcessingTotalsList(processingTotals.CustomerId,
                    project.ProjectId,
                    processingTotals.OfficeIdentifier,
                    DateTimeExtensions.StartOfDay(processingTotals.ReportStartDate),
                    DateTimeExtensions.EndOfDay(processingTotals.ReportEndDate));
            }

            DataViewProcessingTotals summaryDataViewProcessingTotals = new DataViewProcessingTotals();

            foreach (DataViewProcessingTotals dataViewProcessingTotal in dataViewProcessingTotals)
            {
                summaryDataViewProcessingTotals.ActivitiesInScan += dataViewProcessingTotal.ActivitiesInScan;
                summaryDataViewProcessingTotals.AvgFormsPerFolder += dataViewProcessingTotal.AvgFormsPerFolder;
                summaryDataViewProcessingTotals.AvgPagesPerForm += dataViewProcessingTotal.AvgPagesPerForm;
                summaryDataViewProcessingTotals.BoxesReceived += dataViewProcessingTotal.BoxesReceived;
                summaryDataViewProcessingTotals.FoldersCompleted += dataViewProcessingTotal.FoldersCompleted;
                summaryDataViewProcessingTotals.FoldersManifested += dataViewProcessingTotal.FoldersManifested;
                summaryDataViewProcessingTotals.FoldersReceived += dataViewProcessingTotal.FoldersReceived;
                summaryDataViewProcessingTotals.FormsCompleted += dataViewProcessingTotal.FormsCompleted;
                summaryDataViewProcessingTotals.IssueFolders += dataViewProcessingTotal.IssueFolders;
                summaryDataViewProcessingTotals.PagesCompleted += dataViewProcessingTotal.PagesCompleted;
                summaryDataViewProcessingTotals.PagesTransmitted += dataViewProcessingTotal.PagesTransmitted;
                summaryDataViewProcessingTotals.PriorityFolders += dataViewProcessingTotal.PriorityFolders;
            }

            var responseObject = new
            {
                Result = summaryDataViewProcessingTotals
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetInvoicingReports(ProcessingTotals processingTotals)
        {
            DataViewProcessingTotals[] dataViewProcessingTotals;

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                ProjectList projectList = flowHubClient.ProjectGetList(null, null, processingTotals.AgencyName);

                Project project = projectList.FirstOrDefault();

                dataViewProcessingTotals = flowHubClient.GetProcessingTotalsList(processingTotals.CustomerId,
                    project.ProjectId,
                    processingTotals.OfficeIdentifier,
                    DateTimeExtensions.StartOfDay(processingTotals.ReportStartDate),
                    DateTimeExtensions.EndOfDay(processingTotals.ReportEndDate));
            }

            var responseObject = new
            {
                Result = dataViewProcessingTotals
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetProductionReports(ProcessingTotals processingTotals)
        {
            DataViewProcessingTotals[] dataViewProcessingTotals;

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                ProjectList projectList = flowHubClient.ProjectGetList(null, null, processingTotals.AgencyName);

                Project project = projectList.FirstOrDefault();

                dataViewProcessingTotals = flowHubClient.GetProcessingTotalsList(processingTotals.CustomerId,
                    project.ProjectId,
                    processingTotals.OfficeIdentifier,
                    DateTimeExtensions.StartOfDay(processingTotals.ReportStartDate),
                    DateTimeExtensions.EndOfDay(processingTotals.ReportEndDate));
            }

            var responseObject = new
            {
                Result = dataViewProcessingTotals
            };

            return new JavaScriptSerializer().Serialize(responseObject);
        }

        public class BoxManifestWithItems
        {
            public BoxManifest BoxManifest { get; set; }
            public BoxManifestItemList BoxManifestItemsList { get; set; }
        }

        public class Manifests
        {
            public string Agency { get; set; }
            public string ConversionType { get; set; }
            public long SPManifestId { get; set; }
            public int Parcels { get; set; }
            public int ProjectOfficeIdentifierId { get; set; }
            public string Status { get; set; }
        }

        public class ManifestItems
        {
            public string SSN { get; set; }
            public string MergeStatus { get; set; }
            public long SPManifestId { get; set; }
        }

        public class POID
        {
            public long ProjectOfficeIdentifierId { get; set; }
            public string StreetAddress { get; set; }
            public string OfficeIdentifier { get; set; }
        }

        public class ProcessingTotals
        {
            public long? CustomerId { get; set; }
            public string AgencyName { get; set; }
            public string OfficeIdentifier { get; set; }
            public DateTime ReportStartDate { get; set; }
            public DateTime ReportEndDate { get; set; }
        }

        private long GetChangeUserId()
        {
            long changeUserId = 0;

            using (FlowHubClient flowHubClient = new FlowHubClient("WSHttpBinding_IFlowHub"))
            {
                LocationList locationList = flowHubClient.LocationGetList(null, "Tampa Channelside");

                if (SPContext.Current != null)
                {
                    var currentUserLogin = SPContext.Current.Web.CurrentUser.LoginName;

                    SPServiceContext serviceContext = SPServiceContext.GetContext(SPContext.Current.Web.Site);
                    UserProfileManager userProfileManager = new UserProfileManager(serviceContext);
                    UserProfile userProfile = userProfileManager.GetUserProfile(currentUserLogin);

                    var firstName = Convert.ToString(userProfile["FirstName"]);
                    var lastName = Convert.ToString(userProfile["LastName"]);
                    var accountName = Convert.ToString(userProfile["AccountName"]);

                    var accountNameSplit = accountName.Split('\\');
                    var domainPart = accountNameSplit[0].ToString();
                    var domainPartSplit = domainPart.Split('|');

                    var domain = domainPartSplit[domainPartSplit.Count() - 1];
                    var login = accountNameSplit[1].ToString();

                    changeUserId = flowHubClient.UserRegister(locationList.FirstOrDefault().LocationId, domain, login, lastName, firstName, true);
                }
            }

            return changeUserId;
        }
        private string Serialize(object sourceObject)
        {
            XmlWriterSettings xmlWriterSettings = new XmlWriterSettings()
            {
                Encoding = new UTF8Encoding(false),
                Indent = true,
                IndentChars = "  ",
                NewLineOnAttributes = true,
                NewLineHandling = NewLineHandling.Entitize
            };

            XmlSerializer xmlSerializer = new XmlSerializer(sourceObject.GetType());
            MemoryStream ms = new MemoryStream();

            using (var xw = XmlWriter.Create(ms, xmlWriterSettings))
            {
                xmlSerializer.Serialize(xw, sourceObject);
                return Encoding.UTF8.GetString(ms.ToArray());
            }
        }

        /*private string SerializeToXmlString<T>(this T sourceObject)
        {
            var xmlWriterSettings = new XmlWriterSettings
            {
                Encoding = new UTF8Encoding(false),
                Indent = true,
                IndentChars = "  ",
                NewLineOnAttributes = true,
                NewLineHandling = NewLineHandling.Entitize
            };

            using (var writer = new StringWriter())
            {
                using (var xmlWriter = XmlWriter.Create(writer, xmlWriterSettings))
                {
                    var xmlSerializer = new XmlSerializer(typeof(T));
                    xmlSerializer.Serialize(xmlWriter, sourceObject);
                    return writer.ToString();
                }
            }
        }*/
    }

    public static class DateTimeExtensions
    {
        public static DateTime EndOfDay(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, date.Day, 23, 59, 59, 999);
        }

        public static DateTime StartOfDay(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, date.Day, 00, 00, 00, 0);
        }
    }
}
