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

    static Settings(language) {
        switch (language) {
            case "spanish":
                return "Ajustes";
            case "french":
                return "Paramètres";
            case "english":
            default:
                return "Settings";
        }
    }

    static EditUsername(language) {
        switch (language) {
            case "spanish":
                return "Editar Nombre de Usuario";
            case "french":
                return "Modifier le Nom d'Utilisateur";
            case "english":
            default:
                return "Edit Username";
        }
    }

    static ResetPassword(language) {
        switch (language) {
            case "spanish":
                return "Restablecer Contraseña";
            case "french":
                return "Réinitialiser le Mot de Passe";
            case "english":
            default:
                return "Reset Password";
        }
    }

    static Logout(language) {
        switch (language) {
            case "spanish":
                return "Cerrar Sesión";
            case "french":
                return "Se Déconnecter";
            case "english":
            default:
                return "Log Out";
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

    static Profile(language) {
        switch (language) {
            case "spanish":
                return "Perfil";
            case "french":
                return "Profil";
            case "english":
            default:
                return "Profile";
        }
    }

    static EnterVerificationCode(language) {
        switch (language) {
            case "spanish":
                return "Por favor, introduce el código de verificación";
            case "french":
                return "Veuillez entrer le code de vérification";
            case "english":
            default:
                return "Please enter the verification code";      
        }
    }

    static Submit(language) {
        switch (language) {
            case "spanish":
                return "Enviar";
            case "french":
                return "Soumettre";
            case "english":
            default:
                return "Submit";
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

    static LeaderboardHeader(header, language) {
        switch (header) {
            case "USERNAME":
                switch (language) {
                    case "spanish":
                        return "Nombre de Usuario";
                    case "french":
                        return "Nom d'Utilisateur";
                    case "english":
                    default:
                        return "Username";
                }
            case "OVERALL_LEVEL":
                switch (language) {
                    case "spanish":
                        return "Nivel";
                    case "french":
                        return "Niveau";
                    case "english":
                    default:
                        return "Level";
                }
            case "LOCATION_STREAK":
                switch (language) {
                    case "spanish":
                        return "Racha de Lugares";
                    case "french":
                        return "Série de Lieux";
                    case "english":
                    default:
                        return "Location Streak";
                }
            case "SOURCE_STREAK":
                switch (language) {
                    case "spanish":
                        return "Racha de Fuentes";
                    case "french":
                        return "Série de Sources";
                    case "english":
                    default:
                        return "Source Streak";
                }
            case "TOPIC_STREAK":
                switch (language) {
                    case "spanish":
                        return "Racha de Temas";
                    case "french":
                        return "Série de Thèmes";
                    case "english":
                    default:
                        return "Topic Streak";
                }
            case "LOCATION_STREAK_HIGH":
                switch (language) {
                    case "spanish":
                        return "Racha de Lugares Más Alta";
                    case "french":
                        return "Série de Lieux la Plus Longue";
                    case "english":
                    default:
                        return "Highest Location Streak";
                }
            case "SOURCE_STREAK_HIGH":
                switch (language) {
                    case "spanish":
                        return "Racha de Fuentes Más Alta";
                    case "french":
                        return "Série de Sources la Plus Longue";
                    case "english":
                    default:
                        return "Highest Source Streak";
                }
            case "TOPIC_STREAK_HIGH":
                switch (language) {
                    case "spanish":
                        return "Racha de Temas Más Alta";
                    case "french":
                        return "Série de Thèmes la Plus Longue";
                    case "english":
                    default:
                        return "Highest Topic Streak";
                }
            case "LOCATION_TOTAL_CORRECT":
                switch (language) {
                    case "spanish":
                        return "Total de Lugares Correctos";
                    case "french":
                        return "Total de Lieux Corrects";
                    case "english":
                    default:
                        return "Total Correct Locations";
                }
            case "SOURCE_TOTAL_CORRECT":
                switch (language) {
                    case "spanish":
                        return "Total de Fuentes Correctas";
                    case "french":
                        return "Total de Sources Correctes";
                    case "english":
                    default:
                        return "Total Correct Sources";
                }
            case "TOPIC_TOTAL_CORRECT":
                switch (language) {
                    case "spanish":
                        return "Total de Temas Correctos";
                    case "french":
                        return "Total de Thèmes Corrects";
                    case "english":
                    default:
                        return "Total Correct Topics";
                }
            case "LOCATION_ACCURACY":
                switch (language) {
                    case "spanish":
                        return "Precisión de Lugares";
                    case "french":
                        return "Précision des Lieux";
                    case "english":
                    default:
                        return "Location Accuracy";
                }
            case "SOURCE_ACCURACY":
                switch (language) {
                    case "spanish":
                        return "Precisión de Fuentes";
                    case "french":
                        return "Précision des Sources";
                    case "english":
                    default:
                        return "Source Accuracy";
                }
            case "TOPIC_ACCURACY":
                switch (language) {
                    case "spanish":
                        return "Precisión de Temas";
                    case "french":
                        return "Précision des Thèmes";
                    case "english":
                    default:
                        return "Topic Accuracy";
                }
            case "LOCATION_ACCURACY_HIGH":
                switch (language) {
                    case "spanish":
                        return "Precisión de Lugares Más Alta";
                    case "french":
                        return "Précision des Lieux la Plus Haute";
                    case "english":
                    default:
                        return "Highest Location Accuracy";
                }
            case "SOURCE_ACCURACY_HIGH":
                switch (language) {
                    case "spanish":
                        return "Precisión de Fuentes Más Alta";
                    case "french":
                        return "Précision des Sources la Plus Haute";
                    case "english":
                    default:
                        return "Highest Source Accuracy";
                }
            case "TOPIC_ACCURACY_HIGH":
                switch (language) {
                    case "spanish":
                        return "Precisión de Temas Más Alta";
                    case "french":
                        return "Précision des Thèmes la Plus Haute";
                    case "english":
                    default:
                        return "Highest Topic Accuracy";
                }
            case "TOTAL_PLAYED":
                switch (language) {
                    case "spanish":
                        return "Total Jugado";
                    case "french":
                        return "Total Joué";
                    case "english":
                    default:
                        return "Total Played";
                }
            default:
                return header;
        }
    };

    static AvatarEditor(language) {
        switch (language) {
            case "spanish":
                return "Editor de Avatar";
            case "french":
                return "Éditeur d'Avatar";
            case "english":
            default:
                return "Avatar Editor";
        }
    };

    static EditAvatar(language) {
        switch (language) {
            case "spanish":
                return "Editar Avatar";
            case "french":
                return "Modifier l'Avatar";
            case "english":
            default:
                return "Edit Avatar";
        }
    }

    static AddFriend(language) {
        switch (language) {
            case "spanish":
                return "Añadir Amigo";
            case "french":
                return "Ajouter un Ami";
            case "english":
            default:
                return "Add Friend";
        }
    }

    static FriendStatus(status, language) {
        switch (status) {
            case "ALREADY_FRIENDS":
                switch (language) {
                    case "spanish":
                        return "Amigos";
                    case "french":
                        return "Amis";
                    case "english":
                    default:
                        return "Friends";
                }
            case "FRIEND_REQUEST_SENT":
                switch (language) {
                    case "spanish":
                        return "Solicitud de amistad enviada";
                    case "french":
                        return "Demande d'ami envoyée";
                    case "english":
                    default:
                        return "Friend Request Sent";
                }
            default:
                return "";
        }
    }

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

    static LoginError(response, language) {
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
            case "INVALID_TOKEN":
                switch (language) {
                    case "spanish":
                        return "Por favor, inicia sesión de nuevo";
                    case "french":
                        return "Veuillez vous reconnecter";
                    case "english":
                    default:
                        return "Please sign in again";
                }
            default:
                return response;
        }
    }

    static Statistics(language) {
        switch (language) {
            case "spanish":
                return "Estadísticas";
            case "french":
                return "Statistiques";
            case "english":
            default:
                return "Statistics";
        }
    }

    static Level(language) {
        switch (language) {
            case "spanish":
                return "Nivel";
            case "french":
                return "Niveau";
            case "english":
            default:
                return "Level";
        }
    }

    static Streaks(language) {
        switch (language) {
            case "spanish":
                return "Rachas";
            case "french":
                return "Séries";
            case "english":
            default:
                return "Streaks";
        }
    }

    static HighestStreaks(language) {
        switch (language) {
            case "spanish":
                return "Rachas Más Altas";
            case "french":
                return "Séries les Plus Longues";
            case "english":
            default:
                return "Highest Streaks";
        }
    }

    static Accuracy(language) {
        switch (language) {
            case "spanish":
                return "Precisión";
            case "french":
                return "Précision";
            case "english":
            default:
                return "Accuracy";
        }
    }

    static TotalPlayed(language) {
        switch (language) {
            case "spanish":
                return "Total Jugado";
            case "french":
                return "Total Joué";
            case "english":
            default:
                return "Total Played";
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