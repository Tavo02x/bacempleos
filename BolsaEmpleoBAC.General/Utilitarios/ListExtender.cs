using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.General.Utilitarios
{
    public static class ListExtender
    {
        /// <summary>
        /// Ordena aleatoriamente una lista.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="input"></param>
        /// <returns></returns>
        public static List<T> RandomList<T>(this List<T> input)
        {
            List<T> arr = input;
            List<T> arrDes = new List<T>();

            Random randNum = new Random();
            while (arr.Count > 0)
            {
                int val = randNum.Next(0, arr.Count - 1);
                arrDes.Add(arr[val]);
                arr.RemoveAt(val);
            }

            return arrDes;
        }
    }
}
