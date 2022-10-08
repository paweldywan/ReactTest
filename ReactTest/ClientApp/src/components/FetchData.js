import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = {
            forecasts: [], sort: { column: 'date', order: 'desc' }, pagination: { currentPage: 1, pageSize: 10 }, loading: true
        };
        this.populateWeatherData = this.populateWeatherData.bind(this);
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    static getPostfix(sort, currentColumn) {
        let { column, order } = sort;

        return currentColumn === column ?
            (order === 'asc' ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />)
            : null;
    }

    setSort(currentColumn) {
        return () => {
            let { column, order } = this.state.sort;

            order = (order === 'asc' && column === currentColumn) ? 'desc' : 'asc';

            this.setState({ sort: { column: currentColumn, order: order } });

            this.populateWeatherData();
        }
    }

    nextPage() {
        return () => {
            let { currentPage, pageSize } = this.state.pagination;

            this.setState({ pagination: { currentPage: currentPage + 1, pageSize: pageSize } });

            this.populateWeatherData();
        }
    }

    previousPage() {
        return () => {
            let { currentPage, pageSize } = this.state.pagination;

            this.setState({ pagination: { currentPage: currentPage - 1, pageSize: pageSize } });

            this.populateWeatherData();
        }
    }

    setPage(page) {
        return () => {
            let { _, pageSize } = this.state.pagination;

            this.setState({ pagination: { currentPage: page, pageSize: pageSize } });

            this.populateWeatherData();
        }
    }

    renderForecastsTable() {
        const sort = this.state.sort;

        return (
            <>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th role="button" onClick={this.setSort('date')}>Date {FetchData.getPostfix(sort, 'date')}</th>
                            <th role="button" onClick={this.setSort('temperatureC')}>Temp. (C) {FetchData.getPostfix(sort, 'temperatureC')}</th>
                            <th role="button" onClick={this.setSort('temperatureF')}>Temp. (F) {FetchData.getPostfix(sort, 'temperatureF')}</th>
                            <th role="button" onClick={this.setSort('summary')}>Summary {FetchData.getPostfix(sort, 'summary')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.forecasts.data.map(forecast =>
                            <tr key={forecast.date}>
                                <td>{forecast.date}</td>
                                <td>{forecast.temperatureC}</td>
                                <td>{forecast.temperatureF}</td>
                                <td>{forecast.summary}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <nav aria-label="...">
                    <ul className="pagination">
                    {
                        this.state.pagination.currentPage === 1 ?
                        <li className="page-item disabled">
                            <span className="page-link">Previous</span>
                        </li> : 
                        <li className="page-item">
                            <a className="page-link" href="javascript:void(0)" tabindex="-1" onClick={this.previousPage()}>Previous</a>
                        </li>
                        }
                    <>
                        {
                                [...Array(this.state.forecasts.pages).keys()].map(p => p + 1 !== this.state.pagination.currentPage ?
                                    <li className="page-item"><a className="page-link" href="javascript:void(0)" onClick={this.setPage(p + 1)}>{p + 1}</a></li> :
                                    <li class="page-item active">
                                        <span class="page-link">
                                            {p + 1}
                                            <span class="sr-only">(current)</span>
                                        </span>
                                    </li>)
                        }
                    </>
                    {
                        this.state.pagination.currentPage === this.state.forecasts.pages ?
                        <li className="page-item disabled">
                            <span className="page-link">Next</span>
                        </li> :
                        <li className="page-item">
                            <a className="page-link" href="javascript:void(0)" onClick={this.nextPage()}>Next</a>
                        </li>
                    }
                  </ul>
                </nav>
            </>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderForecastsTable();

        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                <button disabled={this.state.loading} className="btn btn-primary mb-2" onClick={this.populateWeatherData}>Refresh</button>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const token = await authService.getAccessToken();

        const response = await fetch('weatherforecast?' + new URLSearchParams({
            CurrentPage: this.state.pagination.currentPage,
            PageSize: this.state.pagination.pageSize,
            Sort: this.state.sort.column,
            SortDirection: this.state.sort.order
        }),
        {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        this.setState({ forecasts: data, loading: false });
    }
}
