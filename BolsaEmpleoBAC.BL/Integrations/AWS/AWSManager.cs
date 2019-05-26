using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using System;
using System.Configuration;
using System.IO;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Integrations.AWS
{
    public class AWSManager
    {
        // Example creates two objects (for simplicity, we upload same file twice).
        // You specify key names for these objects.
        private static string ApiKey = ConfigurationManager.AppSettings["AWSAccessKey"].ToString(); //your s3 bucket name goes here  
        private static string ApiSecret = ConfigurationManager.AppSettings["AWSSecretKey"].ToString();
        private static string AmazonPath = ConfigurationManager.AppSettings["AWSUrl"].ToString();

        static string myBucketName = ConfigurationManager.AppSettings["AWSBucket"].ToString(); //your s3 bucket name goes here  
        static string s3DirectoryName = ConfigurationManager.AppSettings["AWSBucketDirectory"].ToString();

        public static string SendMyFileToS3(string localFilePath, string fileNameInS3)
        {
  
            try
            {
                string key = "bac_" + fileNameInS3;
                IAmazonS3 client = new AmazonS3Client(ApiKey,ApiSecret,RegionEndpoint.USEast2);
                PutObjectRequest request = new PutObjectRequest()
                {
                    BucketName = myBucketName + @"/" + s3DirectoryName,
                    Key = key,
                    FilePath = localFilePath+@"/"+ fileNameInS3,
                    CannedACL = S3CannedACL.PublicRead
                };
                PutObjectResponse response = client.PutObject(request);

                return AmazonPath+ key;
            }
            catch (AmazonS3Exception amazonS3Exception)
            {
                if (amazonS3Exception.ErrorCode != null &&
                  (amazonS3Exception.ErrorCode.Equals("InvalidAccessKeyId")
                  ||
                  amazonS3Exception.ErrorCode.Equals("InvalidSecurity")))
                {
                    throw new Exception("Check the provided AWS Credentials.");
                }
                else
                {
                    throw new Exception(string.Format("Error occurred. Message:'{0}' when writing an object", amazonS3Exception.Message));
                }
            }
        }
    }
}