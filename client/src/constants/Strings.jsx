export default class Strings {
    static Home(language) {
        switch (language) {
            case "english":
                return "Home";
            case "spanish":
                return "Inicio";
            case "french":
                return "Accueil";
            default:
                return "Home";
        }
    }

    static Email(language) {
        switch (language) {
            case "english":
                return "Email";
            case "spanish":
                return "Correo Electrónico";
            case "french":
                return "Courriel";
            default:
                return "Email";
        }
    }
    
    static Username(language) {
        switch (language) {
            case "english":
                return "Username";
            case "spanish":
                return "Nombre de Usuario";
            case "french":
                return "Nom d'Utilisateur";
            default:
                return "Username";
        }
    }

    static Password(language) {
        switch (language) {
            case "english":
                return "Password";
            case "spanish":
                return "Contraseña";
            case "french":
                return "Mot de Passe";
            default:
                return "Password";
        }
    }

    static Login(language) {
        switch (language) {
            case "english":
                return "Login";
            case "spanish":
                return "Acceso";
            case "french":
                return "Se cibbecter";
            default:
                return "Login";
        }
    }

    static Signup(language) {
        switch (language) {
            case "english":
                return "Signup";
            case "spanish":
                return "Registrarse";
            case "french":
                return "S'inscrire";
            default:
                return "Signup";
        }
    }

    static NextQuestion(language) {
        switch (language) {
            case "english":
                return "Next Question";
            case "spanish":
                return "Siguiente Pregunta";
            case "french":
                return "Question Suivante";
            default:
                return "Next Question";
        }
    }

    static Correct(language) {
        switch (language) {
            case "english":
                return "Correct!";
            case "spanish":
                return "¡Correcto!";
            case "french":
                return "Correct!";
            default:
                return "Correct!";
        }
    }

    static Incorrect(language) {
        switch (language) {
            case "english":
                return "Incorrect!";
            case "spanish":
                return "¡Incorrecto!";
            case "french":
                return "Incorrect!";
            default:
                return "Incorrect!";
        }
    }

    static Leaderboard(language) {
        switch (language) {
            case "english":
                return "Leaderboard";
            case "spanish":
                return "Tabla de Clasificación";
            case "french":
                return "Classement";
            default:
                return "Leaderboard";
        }
    };

    static ChooseLanguage(language) {
        switch (language) {
            case "english":
                return "Choose your Language";
            case "spanish":
                return "Elige tu Idioma";
            case "french":
                return "Choisissez votre Langue";
            default:
                return "Choose your Language";
        }
    }

    static English() {
        return "English";
    }

    static Spanish() {
        return "Español"
    }

    static French() {
        return "Français";
    }
}