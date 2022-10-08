using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ReactTest.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet]
        public Pagination<WeatherForecast> Get([FromQuery] PaginationRequest request)
        {
            var data = Enumerable.Range(1, 50).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            });

            int pages = data.Count() / request.PageSize;

            if (request.SortDirection == "desc")
            {
                switch (request.Sort)
                {
                    case "date":
                        data = data.OrderByDescending(d => d.Date);
                        break;

                    case "temperatureC":
                        data = data.OrderByDescending(d => d.TemperatureC);
                        break;

                    case "temperatureF":
                        data = data.OrderByDescending(d => d.TemperatureF);
                        break;

                    case "summary":
                        data = data.OrderByDescending(d => d.Summary);
                        break;

                    default:
                        break;
                }
            }
            else
            {
                switch (request.Sort)
                {
                    case "date":
                        data = data.OrderBy(d => d.Date);
                        break;

                    case "temperatureC":
                        data = data.OrderBy(d => d.TemperatureC);
                        break;

                    case "temperatureF":
                        data = data.OrderBy(d => d.TemperatureF);
                        break;

                    case "summary":
                        data = data.OrderBy(d => d.Summary);
                        break;

                    default:
                        break;
                }
            }

            data = data
                .Skip((request.CurrentPage - 1) * request.PageSize)
                .Take(request.PageSize);

            return new Pagination<WeatherForecast>(pages, data);
        }
    }
}