namespace Quizz.Models
{
    public class ResponseModel<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T Data { get; set; }
        public int code { get; set; } = 200;
        public ResponseModel(bool success, string message, T data, int code)
        {
            Success = success;
            Message = message;
            Data = data;
            this.code = code;
        }
    }
}
