export default class Colors {
    static Background(dark) {
        return dark ? "#1F1F1F" : "#E8E8E8";
    }

    static Text(dark) {
        return dark ? "#E8E8E8" : "#1F1F1F";
    }

    static Accent(dark, level) {
        if (dark) {
            switch (level) {
                case 1:
                    return "#FFBE0B";
                case 2:
                    return "#FB5607";
                case 3:
                    return "#FF006E";
                case 4:
                    return "#8338EC";
                case 5:
                    return "#3A86FF";
                default:
                    console.warn("Colors.Accent() called with invalid level parameter.");
                    return "FF00FF";
            }
        } else {
            switch (level) {
                case 1:
                    return "#FFBE0B";
                case 2:
                    return "#FB5607";
                case 3:
                    return "#FF006E";
                case 4:
                    return "#8338EC";
                case 5:
                    return "#3A86FF";
                default:
                    console.warn("Colors.Accent() called with invalid level parameter.");
                    return "FF00FF";
            }
        }
    }
}