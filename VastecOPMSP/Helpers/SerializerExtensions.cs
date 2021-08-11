using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace VastecOPMSP.Helpers
{
    public static class SerializerExtensions
    {
        /// <summary>
        /// XML String serializer extension method.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sourceObject"></param>
        /// <returns></returns>
        public static string SerializeToXmlString<T>(this T sourceObject)
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
        }

        /// <summary>
        /// XML String deserializer extension method.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="serializedXml"></param>
        /// <returns></returns>
        public static T DeserializeXmlString<T>(this string serializedXml) where T : class
        {
            T returnObject = null;

            if (!string.IsNullOrWhiteSpace(serializedXml))
            {
                using (var sr = new StringReader(serializedXml))
                {
                    var serializer = new XmlSerializer(typeof(T));
                    returnObject = serializer.Deserialize(sr) as T;
                }
            }

            return returnObject;
        }

        /// <summary>
        /// Json String serializer extension method.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sourceObject"></param>
        /// <returns></returns>
        //public static string SerializeToJsonString<T>(this T sourceObject)
        //{
        //    return JsonConvert.SerializeObject(sourceObject);
        //}

        /// <summary>
        /// Json String deserializer extension method.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="serializedJson"></param>
        /// <returns></returns>
        //public static T DeserializeJsonString<T>(this string serializedJson) where T : class
        //{
        //    return JsonConvert.DeserializeObject<T>(serializedJson);
        //}
    }
}
