import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = {
            forecasts: [], sort: { column: null, order: null }, loading: true
        };
        this.populateWeatherData = this.populateWeatherData.bind(this);
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    static sort(forecasts, sort) {
        const { column, order } = sort;

        if (!column || !order) {
            return forecasts;
        }

        if (order === 'asc') {
            return forecasts.sort((a, b) => (a[column] > b[column] ? 1 : -1));
        }
        else {
            return forecasts.sort((a, b) => (a[column] > b[column] ? -1 : 1));
        }
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
        }
    }

    renderForecastsTable() {
        const sort = this.state.sort;

        return (
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
                    {FetchData.sort(this.state.forecasts, sort).map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
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
        if (!this.state.loading) {
            this.setState({ loading: true });

            this.setState({ sort: { column: null, order: null } });
        }

        const token = await authService.getAccessToken();

        const response = await fetch('weatherforecast', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        this.setState({ forecasts: data, loading: false });
    }
}
