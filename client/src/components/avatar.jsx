import React from 'react';

import { ReactComponent as Foreground0 } from '../images/avatars/foreground_0.svg';
import { ReactComponent as Foreground1 } from '../images/avatars/foreground_1.svg';
import { ReactComponent as Foreground2 } from '../images/avatars/foreground_2.svg';
import { ReactComponent as Foreground3 } from '../images/avatars/foreground_3.svg';
import { ReactComponent as Foreground4 } from '../images/avatars/foreground_4.svg';
import { ReactComponent as Foreground5 } from '../images/avatars/foreground_5.svg';
import { ReactComponent as Foreground6 } from '../images/avatars/foreground_6.svg';
import { ReactComponent as Foreground7 } from '../images/avatars/foreground_7.svg';

export default class Avatar extends React.Component {
    getForegroundSource() {
        return `/images/avatars/foreground_${this.state.foreground}.svg`;
    }

    getForeground() {
        const style = {
            width: "100%",
            height: "100%",
            stroke: this.props.colors.foreground,
            strokeWidth: "0.75px",
        };

        switch (parseInt(this.props.foreground)) {
            case 1:
                return <Foreground1 style={style} />;
            case 2:
                return <Foreground2 style={style} />;
            case 3:
                return <Foreground3 style={style} />;
            case 4:
                return <Foreground4 style={style} />;
            case 5:
                return <Foreground5 style={style} />;
            case 6:
                return <Foreground6 style={style} />;
            case 7:
                return <Foreground7 style={style} />;
            default:
                return <Foreground0 style={style} />;
        }
    }

    render() {
        const foreground = this.getForeground();

        return (
            <div style={{
                width: this.props.width,
                height: this.props.height,
                backgroundColor: this.props.colors.background,
                borderRadius: "50%",
                overflow: "hidden",
                borderStyle: "solid",
                borderColor: this.props.colors.border,
                borderWidth: "5px"
            }} {...this.props}>
                {foreground}
            </div>
        );
    }
}