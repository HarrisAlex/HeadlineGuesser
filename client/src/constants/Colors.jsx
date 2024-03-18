let dark = localStorage.getItem("darkMode") === "true";

export default class Colors {
    static Background() {
        return dark ? "#1F1F1F" : "#E8E8E8";
    }

    static Text() {
        return dark ? "#E8E8E8" : "#1F1F1F";
    }

    static Accent(level) {
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
                    return "#D49C00";
                case 2:
                    return "#CB4303";
                case 3:
                    return "#CC0057";
                case 4:
                    return "#6414D5";
                case 5:
                    return "#0060FA";
                default:
                    console.warn("Colors.Accent() called with invalid level parameter.");
                    return "FF00FF";
            }
        }
    }
    
    static GlassPanel() {
        return dark ? "#35353580" : "#D8D8D880";
    }

    static GlassPanelBorder() {
        return dark ? "#1C1C1C" : "#C8C8C8";
    }

    static updateDarkMode() {
        dark = localStorage.getItem("darkMode") === "true";
        return;
    }
}