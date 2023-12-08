import React from 'react';
import './LandingPage.css'
import { Octokit } from 'octokit';

export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { uname: '', valid: true };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const octokit = new Octokit();
        var userData;
        var repoData;
        octokit.request("/users/" + this.state.uname)
            .then((res) => { userData = res["data"]; })
            .then(() => { return octokit.request("/users/" + this.state.uname + "/repos"); })
            .then((res) => { repoData = res["data"]; })
            .then(() => { this.props.onUsernameSubmit(userData, repoData) })
            .catch(e => {
                console.log(e);
                this.setState({ valid: false });
            });
    }

    handleChange(e) {
        this.setState({ uname: e.target.value });
    }

    render() {
        return (
            <div className="modal">
                <div className="content-container">
                    <div className="welcome">
                        <span className="first">Welcome</span>
                        
                        <p className="Description"></p>
                    </div>
    
                    <div className="modal-content">
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Enter your GitHub username!
                            </label>
                            <input type="text" value={this.state.uname} onChange={this.handleChange} />
                            <input className="button" type="submit" value="Submit" />
                        </form>
                        {!this.state.valid && <p className="usernameError">An error occurred, please try again.</p>}
                    </div>
                </div>
            </div>
        );
    }
    
}