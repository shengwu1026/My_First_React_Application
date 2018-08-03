var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api.js');
var Loading = require('./Loading');

function SelectLanguage (props) {
    var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
    
    return (
        <ul className='languages'> 
            {languages.map(function (lang) {
                return (
                    <li
                        style={lang === props.selectLanguage ? {color: 'red'} : null}
                        onClick={props.onSelect.bind(null, lang)}
                        key={lang}>
                        {lang}
                    </li>
                )
            })}
        </ul>
    )
}

SelectLanguage.propTypes = {
    selectLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

function RepoGrid (props) {
    return (
        <ul className='popular-list'>
            {props.repos.map(function (repo, index) {
                return (
                    <li key={repo.name} className='popular-item'>
                        <div className='popular-rank'>#{index + 1}</div>
                        <ul className='space-list-items'>
                            <li>
                                <img
                                    className='avatar'
                                    src={repo.owner.avatar_url}
                                    alt={'Avatar for ' + repo.owner.login}
                                />
                            </li>
                            <li><a href={repo.html_url}>{repo.name}</a></li>
                            <li>@{repo.owner.login}</li>
                            <li>{repo.stargazers_count} stars</li>
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
}

RepoGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

class Popular extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectLanguage: 'All',
            repos: null
        };
        this.updateLanguage = this.updateLanguage.bind(this);
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectLanguage)
    }

    updateLanguage(lang) {
        this.setState(function () {
            return {
                selectLanguage: lang,
                repos: null
            }
        });

        api.fetchPopularRepos(lang)
            .then(function (repos) {
                this.setState(function () {
                    return {
                        repos: repos
                    }
                });
            }.bind(this));
    }

    render() {
        return (
            <div>
                <SelectLanguage
                    selectLanguage={this.state.selectLanguage}
                    onSelect={this.updateLanguage}
                />
                {!this.state.repos
                 ? <Loading text='Wow'/>
                 : <RepoGrid repos={this.state.repos} />
                }
            </div>
        )
    }
}
module.exports = Popular;