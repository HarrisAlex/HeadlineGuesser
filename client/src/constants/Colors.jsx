let dark = localStorage.getItem("darkMode") === "true";

export default class Colors {
    static avatarColorsLength = 11;

    static Background() {
        return dark ? "#1F1F1F" : "#F8F8F8";
    }

    static OffsetBackground() {
        return dark ? "#2A2A2A" : "#EFEFEF";
    }

    static ButtonBackground() {
        return dark ? "none" : "#F8F8F8";
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
                    return "#FF4D9A";
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

    static AvatarColors(index) {
        switch (index) {
            case 0:
                return "#FFFFFF";
            case 1: 
                return "#00FF00";
            case 2:
                return "#0000FF";
            case 3:
                return "#FFFF00";
            case 4:
                return "#FF00FF";
            case 5:
                return "#00FFFF";
            case 6:
                return "#FF8000";
            case 7:
                return "#8000FF";
            case 8:
                return "#FF0000";
            case 9:
                return "#000000";
            case 10:
                return "#808080";
            default:
                return "#FFFFFF";
        }
    }
    
    static GlassPanel() {
        return dark ? "#35353580" : "#E8E8E880";
    }

    static GlassPanelBorder() {
        return dark ? "#3C3C3C" : "#A8A8A8";
    }

    static UpdateDarkMode() {
        dark = localStorage.getItem("darkMode") === "true";
        return;
    }
}