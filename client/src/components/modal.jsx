import React from 'react';

import Colors from '../constants/Colors.jsx';
import Button from './button.jsx';

export default class Modal extends React.Component {
    render() {
        return (
            <div style={{
                width: "60svw",
                height: "60svh",
                position: "absolute",
                top: "20svh",
                left: "20svw",
                backgroundColor: Colors.GlassPanel(),
                border: "1px solid " + Colors.GlassPanelBorder(),
                backdropFilter: "blur(10px)",
            }}>
                <div style={{
                    backgroundColor: Colors.GlassPanel(),
                    width: "100%",
                    height: "2.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: "1rem",
                    paddingRight: "0.25rem",
                    borderBottom: "1px solid " + Colors.GlassPanelBorder(),
                }}>
                    <h2>{this.props.header}</h2>
                    <Button type="close" onClick={this.props.close}/>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: "calc(100% - 2rem)",
                    padding: "1rem",
                }}>
                    {this.props.children}
                </div>
                
            </div>
        );
    }
}