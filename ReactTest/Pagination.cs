namespace ReactTest
{
    public class Pagination<T>
    {
        public Pagination(int pages, IEnumerable<T> data)
        {
            Pages = pages;
            Data = data;
        }

        public int Pages { get; set; }

        public IEnumerable<T> Data { get; set; }
    }
}
