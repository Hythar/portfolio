import React from 'react';
import './MainApp.css'
import { FaEyeSlash, FaSave } from 'react-icons/fa';
import { IconContext } from "react-icons";

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editable: true, project: props.project, fileDownloadUrl: null }

        this.hideThisProject = this.hideThisProject.bind(this);
    }

    hideThisProject() {
        this.props.onHideProject(this.props.idx);
    }

    render() {
        const editable = this.state.editable;
        const project = this.state.project;
        const description = project["description"] == null ? '' : project["description"];
        return (
            <div className="card">
                <span className="title">{project["name"]}</span>
                <span className="subtitle">{project["created_at"].split("T")[0]}</span>
                {editable
                    ? <textarea defaultValue={description} spellCheck="false"></textarea>
                    : <p>{description}</p>}
                <div className="footer">
                    <a href={project["html_url"]}>Repository Link</a>
                    {editable && <button className="hide-project-button" onClick={this.hideThisProject}> 
                        <IconContext.Provider value={{ className: "eye-icon" }}>
                            <FaEyeSlash />
                        </IconContext.Provider>
                        </button>}
                </div>
            </div>
        );
    }
}

export default class MainApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: props.userData,
            visibleProjects: props.repoData,
            hiddenProjects: []
        };

        this.exportPage = this.exportPage.bind(this);
        this.hideProject = this.hideProject.bind(this);
    }

    exportPage(e) {
        e.preventDefault();
        const output = new XMLSerializer().serializeToString(document);
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState({ fileDownloadUrl: fileDownloadUrl },
            () => {
                this.dofileDownload.click();
                URL.revokeObjectURL(fileDownloadUrl);
                this.setState({ fileDownloadUrl: "" })
            })
    }

    // hides visibleProjects[idx], which may be a weird order compared to the original props.repoData
    // this is because the child Card calls this function by supplying their ID.
    hideProject(idx) {
        this.setState((state, props) => ({hiddenProjects: [...state.hiddenProjects, state.visibleProjects[idx]]}));
        this.setState((state, props) => ({visibleProjects: state.visibleProjects.filter((project, index) => index != idx) }));
    }

    render() {
        var userData = this.state.userData;
        var visibleProjects = this.state.visibleProjects;
        return (
            <div>
                <a style={{ display: "none" }}
                    download="index.html"
                    href={this.state.fileDownloadUrl}
                    ref={e => this.dofileDownload = e}/>
                
                <div className="header">
                    <div className="pfp"></div>
                    <h1>{userData["name"]}</h1>
                    <button onClick={this.exportPage} className="export-button">
                    <IconContext.Provider value={{ className: "export-icon" }}>
                        <FaSave />
                    </IconContext.Provider>
                        <span>Export</span></button>
                    <ul className="navbar">
                        <li><a href="https://google.com">About</a></li>
                        <li><a href="https://google.com">Projects</a></li>
                    </ul>
                </div>
                <div className="container">
                    {visibleProjects.map((project, index) => 
                        <Card project={project} key={project["name"]} idx={index} onHideProject={this.hideProject} />)}
                </div>
            </div>
        );
    }
}