export default class Colors {
    static Background() {
        return "#1F1F1F";
    }

    static Text() {
        return "#E8E8E8";
    }

    static Accent(level) {
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