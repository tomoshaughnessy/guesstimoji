import React from 'react';

function Footer() {
    return (
        <nav role="navigation" className="nav-table">
            <ul>
                <li>
                    <a
                        href="https://www.linkedin.com/in/tom-o-shaughnessy/"
                        target="_blank"
                    >
                        <img
                            src={'./square-linkedin-512.png'}
                            width="30px"
                            height="auto"
                        />
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/tomoshaughnessy/guesstimoji"
                        target="_blank"
                    >
                        <img
                            src={'./square-github.png'}
                            width="30px"
                            height="auto"
                        />
                    </a>
                </li>
                <li>
                    <a href="http://localhost:3005/graphql" target="_blank">
                        <img
                            src={'./square-graphql.png'}
                            width="30px"
                            height="auto"
                        />
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Footer;
