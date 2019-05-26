using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaEmpleoBAC.WebAPI.Models
{
    public class MeetingsZoom
    {
        public string uuid { get; set; }
        public string id { get; set; }
        public string account_id { get; set; }
        public string host_id { get; set; }
        public string topic { get; set; }
        public string start_time { get; set; }
        public int duration { get; set; }
        public string total_size { get; set; }
        public string recording_count { get; set; }
        public List<Recording_Files> recording_files { get; set; }
    }

    public class Recording_Files
    {
        public string id { get; set; }
        public string meeting_id { get; set; }
        public string recording_start { get; set; }
        public string recording_end { get; set; }
        public string file_type { get; set; }
        public decimal file_size { get; set; }
        public string play_url { get; set; }
        public string download_url { get; set; }
        public string status { get; set; }
        public string deleted_time { get; set; }
        public string recording_type { get; set; }
    }
}