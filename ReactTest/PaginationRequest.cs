namespace ReactTest
{
    public class PaginationRequest
    {
        public PaginationRequest()
        {
            CurrentPage = 1;
            PageSize = 1;
            Sort = "date";
            SortDirection = "asc";
        }

        public PaginationRequest(int currentPage, int pageSize, string sort, string sortDirection)
        {
            CurrentPage = currentPage;
            PageSize = pageSize;
            Sort = sort;
            SortDirection = sortDirection;
        }

        public int CurrentPage { get; set; }

        public int PageSize { get; set; }

        public string Sort { get; set; }

        public string SortDirection { get; set; }
    }
}
