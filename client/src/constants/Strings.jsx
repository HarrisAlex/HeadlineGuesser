export default class Strings {
    static Home(language) {
        switch (language) {
            case "spanish":
                return "Inicio";
            case "french":
                return "Accueil";
            case "english":
            default:
                return "Home";
        }
    }

    static Email(language) {
        switch (language) {
            case "spanish":
                return "Correo Electrónico";
            case "french":
                return "Courriel";
            case "english":
            default:
                return "Email";
        }
    }
    
    static Username(language) {
        switch (language) {
            case "spanish":
                return "Nombre de Usuario";
            case "french":
                return "Nom d'Utilisateur";
            case "english":
            default:
                return "Username";
        }
    }

    static Password(language) {
        switch (language) {
            case "spanish":
                return "Contraseña";
            case "french":
                return "Mot de Passe";
            case "english":
            default:
                return "Password";
        }
    }

    static Login(language) {
        switch (language) {
            case "spanish":
                return "Acceso";
            case "french":
                return "Se cibbecter";
            case "english":
            default:
                return "Login";
        }
    }

    static Signup(language) {
        switch (language) {
            case "spanish":
                return "Registrarse";
            case "french":
                return "S'inscrire";
            case "english":
            default:
                return "Signup";
        }
    }

    static NextQuestion(language) {
        switch (language) {
            case "spanish":
                return "Siguiente Pregunta";
            case "french":
                return "Question Suivante";
            case "english":
            default:
                return "Next Question";
        }
    }

    static Correct(language) {
        switch (language) {
            case "spanish":
                return "¡Correcto!";
            case "french":
                return "Correct!";
            case "english":
            default:
                return "Correct!";
        }
    }

    static Incorrect(language) {
        switch (language) {
            case "spanish":
                return "¡Incorrecto!";
            case "french":
                return "Incorrect!";
            case "english":
            default:
                return "Incorrect!";
        }
    }

    static Leaderboard(language) {
        switch (language) {
            case "spanish":
                return "Tabla de Clasificación";
            case "french":
                return "Classement";
            case "english":
            default:
                return "Leaderboard";
        }
    };

    static ChooseLanguage(language) {
        switch (language) {
            case "spanish":
                return "Elige tu Idioma";
            case "french":
                return "Choisissez votre Langue";
            case "english":
            default:
                return "Choose your Language";
        }
    }

    static UserBackendResponse(response, language) {
        switch (response) {
            case "EMAIL_EXISTS":
                switch (language) {
                    case "spanish":
                        return "El correo electrónico ya existe";
                    case "french":
                        return "L'email existe déjà";
                    case "english":
                    default:
                        return "Email already exists";
                }
            case "PASSWORD_LENGTH_ERROR":
                switch (language) {
                    case "spanish":
                        return "La contraseña debe tener al menos 8 caracteres";
                    case "french":
                        return "Le mot de passe doit contenir au moins 8 caractères";
                    case "english":
                    default:
                        return "Password must be at least 8 characters";
                }
            case "USER_CREATED":
                switch (language) {
                    case "spanish":
                        return "Usuario creado";
                    case "french":
                        return "Utilisateur créé";
                    case "english":
                    default:
                        return "User created";
                }
            case "INVALID_USER":
                switch (language) {
                    case "spanish":
                        return "Combinación de correo electrónico y contraseña no válida";
                    case "french":
                        return "Combinaison e-mail et mot de passe invalide";
                    case "english":
                    default:
                        return "Invalid email and password combination";
                }
            default:
                return response;
        }
    }

    static Score(language) {
        switch (language) {
            case "spanish":
                return "Puntuación";
            case "french":
                return "Score";
            case "english":
            default:
                return "Score";
        }
    }

    static Rank(language) {
        switch (language) {
            case "spanish":
                return "Rango";
            case "french":
                return "Rang";
            case "english":
            default:
                return "Rank";
        }
    }

    static Friends(language) {
        switch (language) {
            case "spanish":
                return "Amigos";
            case "french":
                return "Amis";
            case "english":
            default:
                return "Friends";
        }
    }

    static DateJoined(language) {
        switch (language) {
            case "spanish":
                return "Fecha de Registro";
            case "french":
                return "Date d'Inscription";
            case "english":
            default:
                return "Date Joined";
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