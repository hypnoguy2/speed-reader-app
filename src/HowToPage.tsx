import { Table } from "react-bootstrap";

export const HowToPage = () => {
    return (
        <div>
            <p>
                This is a speed reader application which can be controlled by commands in the
                script. Write or copy a script to the editor and press the button to process the
                script. In the settings you can set the amount of loops the script does, and center
                the words using a pivot function.
            </p>
            <p>
                The following options are available (More Options are in the making, as well as an
                Strobe effect for this application):
            </p>
            <Table bordered>
                <thead>
                    <tr>
                        <th>key (default)</th>
                        <th>example</th>
                        <th>description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>wpm (300)</td>
                        <td>{"<wpm=300>"}</td>
                        <td>Sets the words per minute the script displays</td>
                    </tr>
                    <tr>
                        <td>halt</td>
                        <td>{"<halt=3>"}</td>
                        <td>
                            Makes the script pause for x seconds, displaying the last word previous
                            to the command.
                        </td>
                    </tr>
                    <tr>
                        <td>break</td>
                        <td>{"<break=3>"}</td>
                        <td>
                            Makes the script pause for x seconds, showing no word during the pause.
                        </td>
                    </tr>
                    <tr>
                        <td>fontsize (10vw)</td>
                        <td>{"<fontize=50px>"}</td>
                        <td>
                            Sets the fontsize for the words. Any css values are accepted. Note: The
                            change will be applied to the word previous to the command!
                        </td>
                    </tr>
                </tbody>
            </Table>
            <p>
                This app is mainly to showcase the underlying script reader hook. It is written with
                React and Typescript. Feel free to use it in your own application, if you have any
                questions feel free to ask :)
            </p>
        </div>
    );
};
